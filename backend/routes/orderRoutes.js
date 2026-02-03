import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString("hex");
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

// Create new order
router.post("/", async (req, res) => {
  const { name, email, phone, college, teamName, teamSize, cartItems } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !college || !cartItems || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields or empty cart"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  // Validate phone format (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number. Must be 10 digits."
    });
  }

  try {
    // Extract event IDs from cart
    const eventIds = cartItems.map(item => item.id);

    // Fetch events from database to recalculate price (NEVER TRUST FRONTEND)
    const placeholders = eventIds.map(() => "?").join(",");
    const sql = `SELECT id, event_name, fee FROM events WHERE id IN (${placeholders})`;

    db.query(sql, eventIds, (err, events) => {
      if (err) {
        console.error("Error fetching events:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to validate cart items"
        });
      }

      if (events.length !== cartItems.length) {
        return res.status(400).json({
          success: false,
          message: "Some events in cart are no longer available"
        });
      }

      // Recalculate total amount from database (SERVER-SIDE VALIDATION)
      const totalAmount = events.reduce((sum, event) => sum + parseFloat(event.fee), 0);

      // Generate unique order ID
      const orderId = generateOrderId();

      // Insert order into database
      const insertOrderSql = `
        INSERT INTO orders (
          order_id, name, email, phone, college, team_name, team_size, total_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `;

      const orderValues = [
        orderId,
        name,
        email,
        phone,
        college,
        teamName || null,
        teamSize || 1,
        totalAmount
      ];

      db.query(insertOrderSql, orderValues, (err, result) => {
        if (err) {
          console.error("Error creating order:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to create order"
          });
        }

        // Insert order items
        const insertItemsSql = `
          INSERT INTO order_items (order_id, event_id, event_name, event_fee)
          VALUES ?
        `;

        const itemValues = events.map(event => [
          orderId,
          event.id,
          event.event_name,
          event.fee
        ]);

        db.query(insertItemsSql, [itemValues], (err) => {
          if (err) {
            console.error("Error inserting order items:", err);
            // Rollback: Delete the order if items insertion fails
            db.query("DELETE FROM orders WHERE order_id = ?", [orderId], () => {});
            return res.status(500).json({
              success: false,
              message: "Failed to create order items"
            });
          }

          // Success: Return order details
          res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
              orderId,
              name,
              email,
              totalAmount,
              status: "PENDING",
              events: events.map(e => ({
                id: e.id,
                name: e.event_name,
                fee: e.fee
              }))
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get order by ID
router.get("/:orderId", (req, res) => {
  const { orderId } = req.params;

  const sql = `
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

  db.query(sql, [orderId], (err, rows) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch order"
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order: rows[0]
    });
  });
});

export default router;
