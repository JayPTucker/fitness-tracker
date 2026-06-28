import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateWorkoutPlan,
  getCurrentWorkoutPlan,
  startWorkoutSession
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateWorkoutPlan);

router.get("/current", authMiddleware, getCurrentWorkoutPlan);

router.post("/start", authMiddleware, startWorkoutSession);

export default router;