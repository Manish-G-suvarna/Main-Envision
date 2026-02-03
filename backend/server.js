import express from "express";
import cors from "cors";
import  db  from "./db.js";
import teamRoutes from "./routes/teamRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/team", teamRoutes);//team routes
app.use("/api/events", eventRoutes);//events routes
app.use("/api/orders", orderRoutes);//order routes 

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
