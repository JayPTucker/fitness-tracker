import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProfile, getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/", authMiddleware, createProfile);

router.get("/", authMiddleware, getProfile);

export default router;