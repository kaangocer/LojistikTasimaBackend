import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import {
  getUsers,
  removeUser,
  changeRole
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(
  authMiddleware,
  adminMiddleware
);

router.get(
  "/users",
  getUsers
);

router.delete(
  "/users/:id",
  removeUser
);

router.patch(
  "/users/:id/role",
  changeRole
);

export default router;