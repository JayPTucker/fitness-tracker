import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateWorkoutPlan } from "../controllers/workoutController.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateWorkoutPlan
);

export default router;