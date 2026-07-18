import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,getUnreadCount,markAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getMyNotifications
);

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadCount
);

router.put(
  "/mark-read",
  authMiddleware,
  markAsRead
);
export default router;