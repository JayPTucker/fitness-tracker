import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

import pool from "./db/connection.js";

(async () => {
  try {
    const connection = await pool.getConnection();

    console.log("Connected to MySQL!");

    connection.release();
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
})();