import dotenv from "dotenv";

// Load environment variables FIRST before importing routes
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./db.js";
import setupDatabase from "./setup-db.js";
import teamRoutes from "./routes/teamRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Setup database tables on startup
setupDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);        // Authentication routes
app.use("/api/team", teamRoutes);        // Team routes
app.use("/api/events", eventRoutes);     // Events routes
app.use("/api/orders", orderRoutes);     // Order routes
app.use("/api/payment", paymentRoutes);  // Payment routes (Razorpay)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 ENVISION Backend Server Started");
  console.log("=".repeat(60));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log("\n📚 API Endpoints:");
  console.log("  • Auth:      POST   /api/auth/register | /api/auth/login");
  console.log("  • Events:    GET    /api/events");
  console.log("  • Team:      GET    /api/team");
  console.log("  • Orders:    POST   /api/orders | GET /api/orders/:orderId");
  console.log("  • Payment:   POST   /api/payment/create-order");
  console.log("  • Health:    GET    /api/health");
  console.log("=".repeat(60) + "\n");
});
