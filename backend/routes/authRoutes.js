import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const admin = results[0];

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Success (In production, issue a JWT here)
        res.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    });
});

export default router;