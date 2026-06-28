import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateWorkoutPlan,
  getCurrentWorkoutPlan,
  startWorkoutSession,
  logSet,
  finishWorkoutSession
} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateWorkoutPlan);

router.get("/current", authMiddleware, getCurrentWorkoutPlan);

router.post("/start", authMiddleware, startWorkoutSession);

router.post("/log-set", authMiddleware, logSet);

router.post("/finish", authMiddleware, finishWorkoutSession);

export default router;