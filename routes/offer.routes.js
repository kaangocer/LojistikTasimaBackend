import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createOffer,
  getMyGivenOffers,
  getMyReceivedOffers,
  getAllOffers,
  acceptOffer,
  rejectOffer
} from "../controllers/offer.controller.js";

const router = express.Router();

// Teklif oluştur
router.post("/", authMiddleware, createOffer);

// Kullanıcının verdiği teklifler
router.get("/given", authMiddleware, getMyGivenOffers);

// Kullanıcının aldığı teklifler
router.get("/received", authMiddleware, getMyReceivedOffers);

// Admin → tüm teklifler
router.get("/", authMiddleware, getAllOffers);

// Teklif kabul et → Trip oluşturur
router.post("/:id/accept", authMiddleware, acceptOffer);

//Teklifi reddet
router.post("/:id/reject", authMiddleware, rejectOffer);

export default router;
