import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createLoad,
  getAllLoads,
  getMyLoads,
  getLoadById,
  deleteLoad
} from "../controllers/load.controller.js";

const router = express.Router();

/*
   🔐 TÜM LOAD ENDPOINTLERİ AUTH GEREKTİRİR
*/

router.get("/", authMiddleware, getAllLoads);
router.get("/my", authMiddleware, getMyLoads);
router.get("/:id", authMiddleware, getLoadById);

router.post("/", authMiddleware, createLoad);
router.delete("/:id", authMiddleware, deleteLoad);

export default router;
