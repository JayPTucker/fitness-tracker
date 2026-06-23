import bcrypt from "bcrypt";
import pool from "../db/connection.js";

const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.execute(
      `
      INSERT INTO users
      (
        first_name,
        last_name,
        email,
        password
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message: "User registered",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export default registerUser;