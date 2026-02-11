import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../db.js";
import { authenticateToken } from "./auth.js";

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // FETCH order from database to get the amount (NEVER trust frontend)
    console.log("Fetching order from database for orderId:", orderId);

    db.query("SELECT total_amount FROM orders WHERE order_id = ?", [orderId], async (err, results) => {
      try {
        if (err || results.length === 0) {
          console.error("Order not found:", orderId);
          return res.status(404).json({
            success: false,
            message: "Order not found",
          });
        }

        const totalAmount = results[0].total_amount;
        const amountInPaise = Math.round(totalAmount * 100);

        // Create Razorpay order
        console.log("Attempting to create Razorpay order with:", {
          orderId,
          totalAmount,
          amountInPaise,
          currency: "INR",
        });
        console.log("Razorpay instance:", {
          key_id: process.env.RAZORPAY_KEY_ID ? "SET" : "UNDEFINED",
          key_secret: process.env.RAZORPAY_KEY_SECRET ? "SET" : "UNDEFINED",
        });

        const razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: orderId,
          payment_capture: 1, // Auto capture payment
        });

        if (!razorpayOrder) {
          return res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
          });
        }

        // Update order in database with Razorpay order ID
        const updateQuery = `
          UPDATE orders
          SET razorpay_order_id = ?
          WHERE order_id = ?
        `;

        db.query(updateQuery, [razorpayOrder.id, orderId], (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to update order",
            });
          }

          res.status(201).json({
            success: true,
            orderId: razorpayOrder.id,
            orderAmount: totalAmount,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            message: "Razorpay order created successfully",
          });
        });
      } catch (error) {
        console.error("\n❌ PAYMENT ORDER CREATION FAILED\n");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR STACK:", error.stack);
        console.error("ERROR CODE:", error.code);
        console.error("ERROR STATUS CODE:", error.statusCode);
        console.error("ERROR DESCRIPTION:", error.description);
        console.error("FULL ERROR OBJECT:", error);
        console.error("\nEnv vars check:");
        console.error("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✅ SET" : "❌ UNDEFINED");
        console.error("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "✅ SET" : "❌ UNDEFINED");
        console.error("\n");

        res.status(500).json({
          success: false,
          message: "Error creating payment order",
          error: error.message,
          errorCode: error.code,
          errorDescription: error.description,
          statusCode: error.statusCode
        });
      }
    });
  } catch (error) {
    console.error("Outer error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment order",
      error: error.message,
    });
  }
});

// Verify payment signature
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const {
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const computedSignature = hmac.digest("hex");

    if (computedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Fetch payment details from Razorpay to verify
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Update order with payment details
    const updateQuery = `
      UPDATE orders
      SET
        razorpay_payment_id = ?,
        status = 'CONFIRMED',
        payment_verified_at = NOW()
      WHERE order_id = ?
    `;

    db.query(
      updateQuery,
      [razorpayPaymentId, orderId],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
          });
        }

        // Update event registrations to CONFIRMED
        const confirmRegistrationsQuery = `
          UPDATE event_registrations
          SET status = 'CONFIRMED'
          WHERE order_id = ? AND status = 'PENDING'
        `;

        db.query(confirmRegistrationsQuery, [orderId], (err) => {
          if (err) {
            console.error("Error confirming registrations:", err);
            // Don't fail - registrations are secondary
          }

          // Fetch updated order details
          const selectQuery = `
            SELECT
              o.*,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'event_id', oi.event_id,
                  'event_name', oi.event_name,
                  'event_fee', oi.event_fee
                )
              ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.order_id = ?
            GROUP BY o.id
          `;

          db.query(selectQuery, [orderId], (err, results) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Failed to fetch order",
              });
            }

            res.json({
              success: true,
              message: "Payment verified successfully",
              order: results[0],
            });
          });
        });
      }
    );
  } catch (error) {
    console.error("Payment verification error:", {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      description: error.description,
      fullError: JSON.stringify(error)
    });
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
      razorpayError: error.description || error.code || "Unknown error"
    });
  }
});

// Get payment status
router.get("/status/:orderId", authenticateToken, (req, res) => {
  try {
    const { orderId } = req.params;

    const query = `
      SELECT
        order_id,
        total_amount,
        status,
        razorpay_payment_id,
        payment_verified_at,
        created_at
      FROM orders
      WHERE order_id = ?
    `;

    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch payment status",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const order = results[0];

      res.json({
        success: true,
        paymentStatus: order.status,
        orderId: order.order_id,
        amount: order.total_amount,
        paymentId: order.razorpay_payment_id || null,
        verifiedAt: order.payment_verified_at,
        createdAt: order.created_at,
      });
    });
  } catch (error) {
    console.error("Error fetching payment status:", {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: "Error fetching payment status",
      error: error.message
    });
  }
});

export default router;
