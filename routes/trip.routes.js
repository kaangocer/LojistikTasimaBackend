import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyTrips,
  getAllTrips,updateTripStatus,getMyCarrierTrips,getMyOwnerTrips
} from "../controllers/trip.controller.js";

const router = express.Router();

// Kullanıcı → kendi tripleri
router.get("/my", authMiddleware, getMyTrips);

// Admin → tüm tripler
router.get("/", authMiddleware, getAllTrips);


router.patch("/:id/status", authMiddleware, updateTripStatus);

// taşıyıcı
router.get("/carrier", authMiddleware, getMyCarrierTrips);

// yük sahibi
router.get("/owner", authMiddleware, getMyOwnerTrips);

export default router;
