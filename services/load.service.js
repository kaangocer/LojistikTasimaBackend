import pool from "../db/db.js";

/* =========================
CREATE
========================= */
export const createLoad = async (data) => {
  const {
    ownerId,
    origin_city,
    origin_address,
    destination_city,
    destination_address,
    pickup_time,
    delivery_time,
    price,
    required_vehicle_type,
    tonnage,
    quantity,
    quantity_unit,
    volume_m3,
    fuel_included,
    description
  } = data;

  if (!ownerId) throw new Error("ownerId zorunlu");
  if (!origin_city || !destination_city)
    throw new Error("Şehir bilgisi zorunlu");

  // 🔥 TARİH KONTROLÜ BURADA

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickup_time) {
    const pickupDate = new Date(pickup_time);
    pickupDate.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      throw new Error("Yükleme tarihi geçmiş olamaz.");
    }
  }

  if (delivery_time) {
    const deliveryDate = new Date(delivery_time);
    deliveryDate.setHours(0, 0, 0, 0);

    if (deliveryDate < today) {
      throw new Error("Teslim tarihi geçmiş olamaz.");
    }
  }

  // 🔥 Pickup teslimden sonra olamaz
  if (pickup_time && delivery_time) {
    if (new Date(delivery_time) < new Date(pickup_time)) {
      throw new Error("Teslim tarihi yükleme tarihinden önce olamaz.");
    }
  }

  const result = await pool.query(
    `
    INSERT INTO loads (
      owner_id,
      origin_city, origin_address,
      destination_city, destination_address,
      pickup_time, delivery_time,
      price,
      required_vehicle_type,
      tonnage, quantity, quantity_unit, volume_m3,
      fuel_included, description
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    )
    RETURNING *
    `,
    [
      ownerId,
      origin_city,
      origin_address || null,
      destination_city,
      destination_address || null,
      pickup_time || null,
      delivery_time || null,
      price || null,
      required_vehicle_type || null,
      tonnage || null,
      quantity || null,
      quantity_unit || null,
      volume_m3 || null,
      fuel_included ?? false,
      description || null
    ]
  );

  return result.rows[0];
};

/* =========================
READ
========================= */
export const getAllLoads = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      l.*,
      u.name,
      u.surname,

      EXISTS (
        SELECT 1
        FROM offers o
        WHERE o.load_id = l.id
        AND o.carrier_id = $1
        AND o.status IN ('pending','accepted')
      ) AS has_offered

    FROM loads l
    LEFT JOIN users u
      ON u.id = l.owner_id

    WHERE l.status != 'accepted'

    ORDER BY l.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const getLoadsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM loads
    WHERE owner_id = $1
    AND status != 'accepted'
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const getLoadById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM loads WHERE id=$1`,
    [id]
  );

  return result.rows[0];
};

/* =========================
DELETE
========================= */
export const deleteLoad = async (loadId, userId, role) => {

  // ⭐ ADMIN → sınırsız yetki
  if (role === "admin") {
    await pool.query(
      "DELETE FROM loads WHERE id=$1",
      [loadId]
    );
    return;
  }

  // ⭐ USER → sadece kendi yükü
  const check = await pool.query(
    `
    SELECT id FROM loads
    WHERE id=$1 AND owner_id=$2
    `,
    [loadId, userId]
  );

  if (!check.rows.length)
    throw new Error("Bu yükü silemezsin");

  await pool.query(
    "DELETE FROM loads WHERE id=$1",
    [loadId]
  );
};

