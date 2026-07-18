import pool from "../db/db.js";

// Araç oluştur
export const createVehicle = async ({
  userId,
  plate_number,
  vehicle_type,
  capacity_ton,
  has_fuel_card,
  brand,
  model,
  year
}) => {
  const result = await pool.query(
    `
    INSERT INTO vehicles
    (user_id, plate_number, vehicle_type, capacity_ton, has_fuel_card, brand, model, year)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      userId,
      plate_number,
      vehicle_type,
      capacity_ton,
      has_fuel_card,
      brand,
      model,
      year
    ]
  );

  return result.rows[0];
};

// Kullanıcının araçları
export const getVehiclesByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Admin → tüm araçlar
export const getAllVehicles = async () => {
  const result = await pool.query(
    `
    SELECT v.*, u.name, u.surname
    FROM vehicles v
    JOIN users u ON u.id = v.user_id
    ORDER BY v.created_at DESC
    `
  );
  return result.rows;
};

// Araç sil
export const deleteVehicle = async (vehicleId, userId, role) => {
  if (role !== "admin") {
    const check = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND user_id = $2",
      [vehicleId, userId]
    );

    if (check.rows.length === 0) {
      throw new Error("Bu aracı silme yetkiniz yok");
    }
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);
};
