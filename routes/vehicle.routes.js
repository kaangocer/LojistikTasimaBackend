import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createVehicle,
  getVehicles,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createVehicle);
router.get("/", authMiddleware, getVehicles);
router.delete("/:id", authMiddleware, deleteVehicle);

export default router;
