import * as offerService from "../services/offer.service.js";

export const createOffer = async (req, res) => {
  try {
    const userId = req.user.userId;

    const offer = await offerService.createOffer({
      loadId: req.body.loadId,
      carrierId: userId,
      vehicleId: req.body.vehicleId,
      offerPrice: req.body.offerPrice,
      estimatedPickup: req.body.estimatedPickup,
      estimatedDelivery: req.body.estimatedDelivery,
      message: req.body.message
    });

    res.status(201).json({
      message: "Teklif oluşturuldu",
      offer
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};


// Verilen teklifler
export const getMyGivenOffers = async (req, res) => {
  try {
    const offers = await offerService.getOffersGivenByUser(req.user.userId);
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Teklifler alınamadı" });
  }
};

// Alınan teklifler
export const getMyReceivedOffers = async (req, res) => {
  try {
    const offers = await offerService.getOffersReceivedByUser(req.user.userId);
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Teklifler alınamadı" });
  }
};

// Admin → tüm teklifler
export const getAllOffers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Yetkiniz yok" });
  }

  const offers = await offerService.getAllOffers();
  res.json(offers);
};


export const acceptOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const userId = req.user.userId;

    const trip = await offerService.acceptOffer(offerId, userId);

    res.json({
      message: "Teklif kabul edildi, trip oluşturuldu",
      trip
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

};



export const rejectOffer = async (req, res) => {
  try {

    const offerId = req.params.id;
    const userId = req.user.userId;

    const offer = await offerService.rejectOffer(
      offerId,
      userId
    );

    res.json({
      message: "Teklif reddedildi",
      offer
    });

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }
};