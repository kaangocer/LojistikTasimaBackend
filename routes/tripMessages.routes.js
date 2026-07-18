import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getTripMessages } from "../controllers/tripMessages.controller.js";

const router = express.Router();

router.get(
  "/:tripId/messages",
  authMiddleware,
  getTripMessages
);

export default router;