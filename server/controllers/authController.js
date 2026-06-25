import bcrypt from "bcrypt";
import pool from "../db/connection.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = users[0];

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "4d"
      }
    );

    res.json({
      token
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        created_at
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};