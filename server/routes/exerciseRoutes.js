import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllExercises } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllExercises);

export default router;