import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateWorkoutPlan,
  getCurrentWorkoutPlan,
  startWorkoutSession,
  logSet,
  finishWorkoutSession,
  getWorkoutSummary,
  getWorkoutHistory,
  getLastPerformance
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateWorkoutPlan);

router.get("/current", authMiddleware, getCurrentWorkoutPlan);

router.post("/start", authMiddleware, startWorkoutSession);

router.post("/log-set", authMiddleware, logSet);

router.post("/finish", authMiddleware, finishWorkoutSession);

router.get("/summary", authMiddleware, getWorkoutSummary);

router.get("/history", authMiddleware, getWorkoutHistory);

router.get("/last-performance/:exerciseId", authMiddleware, getLastPerformance);

export default router;