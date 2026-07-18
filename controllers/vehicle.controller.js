import * as vehicleService from "../services/vehicle.service.js";

// Araç ekle
export const createVehicle = async (req, res) => {
  try {
    const userId = req.user.userId;

    const vehicle = await vehicleService.createVehicle({
      userId,
      ...req.body
    });

    res.status(201).json({
      message: "Araç eklendi",
      vehicle
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Araç listele (admin / user)
export const getVehicles = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const vehicles = await vehicleService.getAllVehicles();
      return res.json(vehicles);
    }

    const vehicles = await vehicleService.getVehiclesByUser(req.user.userId);
    res.json(vehicles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Araç sil
export const deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    res.json({ message: "Araç silindi" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
