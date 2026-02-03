import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = `
    SELECT
      e.id,
      e.event_name,
      e.description,
      e.fee,
      e.event_type,
      e.is_mega_event,
      d.department_name
    FROM events e
    JOIN departments d ON d.id = e.department_id
    ORDER BY e.event_type, e.event_name
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch events" });
    }

    // Return events as array with all details
    const events = rows.map(row => ({
      id: row.id,
      name: row.event_name,
      description: row.description || "No description available",
      fee: parseFloat(row.fee) || 0,
      type: row.event_type,
      isMegaEvent: row.is_mega_event || 0,
      department: row.department_name
    }));

    res.json(events);
  });
});

export default router;
