import mysql from "mysql2";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "envision_db",
  port: process.env.DB_PORT || 3306,
});

export default db;

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ MySQL connected successfully");
    console.log(`   Database: ${process.env.DB_NAME || "envision_db"}`);
    console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
  }
});
