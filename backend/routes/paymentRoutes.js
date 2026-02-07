import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../db.js";

const router = express.Router();

/* ----------------------------------------
   Razorpay Instance
---------------------------------------- */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ----------------------------------------
   CREATE RAZORPAY ORDER
   POST /api/payment/create-order
---------------------------------------- */
router.post("/create-order", (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required"
    });
  }

  const sql = `
    SELECT order_id, total_amount, status
    FROM orders
    WHERE order_id = ?
  `;

  db.query(sql, [orderId], async (err, rows) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = rows[0];

    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Order is not eligible for payment"
      });
    }

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.total_amount * 100), // ₹ → paise
        currency: "INR",
        receipt: order.order_id,
        notes: {
          order_id: order.order_id
        }
      });

      return res.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      });
    } catch (error) {
      console.error("Razorpay error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order"
      });
    }
  });
});

/* ----------------------------------------
   VERIFY PAYMENT
   POST /api/payment/verify
---------------------------------------- */
router.post("/verify", (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !orderId
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing payment details"
    });
  }

  // Generate expected signature
  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    // Signature mismatch → FAIL
    const failSql = `
      UPDATE orders
      SET status = 'FAILED'
      WHERE order_id = ?
    `;

    db.query(failSql, [orderId], () => {});

    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }

  // Signature verified → SUCCESS
  const successSql = `
    UPDATE orders
    SET status = 'CONFIRMED',
        razorpay_order_id = ?,
        razorpay_payment_id = ?,
        payment_verified_at = NOW()
    WHERE order_id = ?
  `;

  db.query(
    successSql,
    [razorpay_order_id, razorpay_payment_id, orderId],
    (err) => {
      if (err) {
        console.error("Order update error:", err);
        return res.status(500).json({
          success: false,
          message: "Payment verified but order update failed"
        });
      }

      return res.json({
        success: true,
        message: "Payment verified successfully",
        orderId
      });
    }
  );
});

/* ----------------------------------------
   (OPTIONAL) WEBHOOK HANDLER
   POST /api/payment/webhook
---------------------------------------- */
router.post("/webhook", (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload?.payment?.entity;

  if (!payload) {
    return res.json({ status: "ok" });
  }

  const orderId = payload.notes?.order_id;

  if (!orderId) {
    return res.json({ status: "ok" });
  }

  if (event === "payment.captured") {
    db.query(
      `UPDATE orders SET status = 'CONFIRMED' WHERE order_id = ?`,
      [orderId]
    );
  }

  if (event === "payment.failed") {
    db.query(
      `UPDATE orders SET status = 'FAILED' WHERE order_id = ?`,
      [orderId]
    );
  }

  res.json({ status: "ok" });
});

export default router;
