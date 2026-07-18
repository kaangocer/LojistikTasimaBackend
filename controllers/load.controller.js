import * as loadService from "../services/load.service.js";


/* =========================
CREATE
========================= */
export const createLoad = async (req, res) => {
  try {
    const load = await loadService.createLoad({
      ownerId: req.user.userId,
      ...req.body
    });

    res.status(201).json(load);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* =========================
READ
========================= */
export const getAllLoads = async (req, res) => {
  try {
    const userId = req.user.userId;

    const loads = await loadService.getAllLoads(userId);

    res.json(loads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyLoads = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;

    if (!userId)
      return res.status(401).json({ message: "User bulunamadı" });

    const loads = await loadService.getLoadsByUser(userId);

    res.json(loads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLoadById = async (req, res) => {
  try {
    const load = await loadService.getLoadById(req.params.id);

    if (!load)
      return res.status(404).json({ message: "Bulunamadı" });

    res.json(load);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
DELETE
========================= */
export const deleteLoad = async (req, res) => {
  try {
    const loadId = req.params.id;
    const { userId, role } = req.user;

    await loadService.deleteLoad(loadId, userId, role);

    res.json({ message: "Yük silindi" });

  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

