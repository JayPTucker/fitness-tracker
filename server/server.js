import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";

import pool from "./db/connection.js";
import cors from "cors";

dotenv.config();

const app = express();

// USE THIS FOR DEVELOPMENT
app.use(cors());

// USE THIS FOR PRODUCTION
// app.use(
//   cors({
//     origin: "https://yourdomain.com"
//   })
// );

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/profile",profileRoutes);

app.use("/api/exercises", exerciseRoutes);

(async () => {
  try {
    const connection = await pool.getConnection();

    console.log("Connected to MySQL!");

    connection.release();
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
})();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});