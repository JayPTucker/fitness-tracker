import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProfile }
from "../controllers/profileController.js";

const router = express.Router();

router.post("/", authMiddleware, createProfile);

export default router;