import * as tripService from "../services/trip.service.js";

// Kullanıcının kendi tripleri
export const getMyTrips = async (req, res) => {
  try {
    const userId = req.user.userId;

    const trips = await tripService.getTripsByUser(userId);

    res.json(trips);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin -> tüm tripler
export const getAllTrips = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    const trips = await tripService.getAllTrips();

    res.json(trips);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const updateTripStatus = async (req, res) => {
  try {
    const trip = await tripService.updateTripStatus(
      req.params.id,
      req.user.userId,
      req.body.status
    );

    res.json({
      message: "Trip güncellendi",
      trip
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};


// taşıyıcı view
export const getMyCarrierTrips = async (req, res) => {
  try {
    const data = await tripService.getTripsAsCarrier(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// yük sahibi view
export const getMyOwnerTrips = async (req, res) => {
  try {
    const data = await tripService.getTripsAsOwner(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};