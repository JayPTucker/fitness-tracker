import bcrypt from "bcrypt";
import pool from "../db/connection.js";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {

    const { credential } = req.body;

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    const {
      sub,
      email,
      given_name,
      family_name
    } = payload;

    const [users] =
      await pool.execute(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    let user;

    if (users.length === 0) {

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
          given_name,
          family_name || "",
          email,
          ""
        ]
      );

      const [newUser] =
        await pool.execute(
          `
          SELECT *
          FROM users
          WHERE email = ?
          `,
          [email]
        );

      user = newUser[0];

    } else {

      user = users[0];

    }

    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Google login failed"
    });

  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
    } = req.body;

    if (
      !password ||
      password.length < 8 ||
      password.length > 64
    ) {
      return res.status(400).json({
        message:
          "Password must be between 8 and 64 characters."
      });
    }

    // Email check protection + SQL has it's own protection against dupe emails
    const [existingUsers] =
      await pool.execute(
        `
        SELECT id
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    if (existingUsers.length > 0) {
      // console.log("Email already exists. Please use a different email.");
      return res.status(409).json({
        message: "Email already exists"
      });
    }

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
        created_at,
        profile_completed
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

export const checkEmailExists = async (req, res) => {
  const { email } = req.params;

  try {
    const [users] = await pool.execute(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
