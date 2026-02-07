import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all orders with their items
router.get("/orders", (req, res) => {
    const sql = `
    SELECT 
      o.order_id,
      o.name,
      o.email,
      o.phone,
      o.college,
      o.team_name,
      o.team_size,
      o.total_amount,
      o.status,
      o.created_at,
      oi.event_id,
      oi.event_name,
      oi.event_fee
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    ORDER BY o.created_at DESC
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching admin orders:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        // Group items by order
        const ordersMap = new Map();

        results.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    orderId: row.order_id,
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    college: row.college,
                    teamName: row.team_name,
                    teamSize: row.team_size,
                    totalAmount: row.total_amount,
                    status: row.status,
                    createdAt: row.created_at,
                    events: []
                });
            }

            if (row.event_id) {
                ordersMap.get(row.order_id).events.push({
                    id: row.event_id,
                    name: row.event_name,
                    fee: row.event_fee
                });
            }
        });

        const orders = Array.from(ordersMap.values());
        res.json({ success: true, orders });
    });
});

// Get basic stats
router.get("/stats", (req, res) => {
    const sql = `
    SELECT 
      COUNT(DISTINCT order_id) as total_orders,
      SUM(total_amount) as total_revenue,
      (SELECT COUNT(*) FROM order_items) as total_registrations
    FROM orders
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching stats:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        res.json({
            success: true,
            stats: {
                totalOrders: results[0].total_orders || 0,
                totalRevenue: results[0].total_revenue || 0,
                totalRegistrations: results[0].total_registrations || 0
            }
        });
    });
});

export default router;
