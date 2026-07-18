import express from "express";
import * as controller from "../controllers/vehicleData.controller.js";

const router = express.Router();

router.get("/types", controller.getVehicleTypes);
router.get("/brands", controller.getBrandsByType);
router.get("/models", controller.getModelsByBrand);
router.get("/years", controller.getYearsByModel);

export default router;
