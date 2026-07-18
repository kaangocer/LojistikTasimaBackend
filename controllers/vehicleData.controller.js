import * as vehicleDataService from "../services/vehicleData.service.js";

/* =========================
   TYPES
========================= */

export const getVehicleTypes = async (req, res) => {
  try {
    const types = await vehicleDataService.getVehicleTypes();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   BRANDS
========================= */

export const getBrandsByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type)
      return res.status(400).json({ message: "vehicle type required" });

    const brands = await vehicleDataService.getBrandsByType(type);
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   MODELS UPDATED
========================= */

export const getModelsByBrand = async (req, res) => {
  try {
    const { brand_code, type } = req.query;

    if (!brand_code)
      return res.status(400).json({ message: "brand_code required" });

    if (!type)
      return res.status(400).json({ message: "vehicle type required" });

    const models = await vehicleDataService.getModelsByBrand(
      brand_code,
      type
    );

    res.json(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   YEARS
========================= */

export const getYearsByModel = async (req, res) => {
  try {
    const { model_code } = req.query;

    if (!model_code)
      return res.status(400).json({ message: "model_code required" });

    const years = await vehicleDataService.getYearsByModel(model_code);
    res.json(years);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
