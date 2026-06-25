import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  checkEmailExists,
  googleLogin
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google", googleLogin);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);

router.get("/check-email/:email", checkEmailExists);

export default router;