import pool from "../db/db.js";

export const getTripsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.status,
      t.start_time,
      t.end_time,
      t.created_at,

      u.name AS carrier_name,
      u.surname AS carrier_surname,

      v.brand,
      v.model,
      v.plate_number,

      l.origin_city,
      l.destination_city

    FROM trips t
    JOIN users u ON u.id = t.carrier_id
    JOIN vehicles v ON v.id = t.vehicle_id
    JOIN loads l ON l.id = t.load_id

    WHERE t.carrier_id = $1
       OR l.owner_id = $1

    ORDER BY t.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};



export const getAllTrips = async () => {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.status,
      t.start_time,
      t.end_time,
      t.created_at,

      u.name AS carrier_name,
      u.surname AS carrier_surname,

      v.brand,
      v.model,
      v.plate_number,

      l.origin_city,
      l.destination_city

    FROM trips t
    JOIN users u ON u.id = t.carrier_id
    JOIN vehicles v ON v.id = t.vehicle_id
    JOIN loads l ON l.id = t.load_id

    ORDER BY t.created_at DESC
    `
  );

  return result.rows;
};


export const updateTripStatus = async (tripId, userId, status) => {

  const result = await pool.query(
    `
    UPDATE trips
    SET status = $1
    WHERE id = $2
    AND carrier_id = $3
    RETURNING *
    `,
    [status, tripId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Trip bulunamadı veya yetkiniz yok");
  }

  const trip = result.rows[0];

  // Sefer iptal edilirse yük tekrar yayınlansın
 if (status === "cancelled") {

  await pool.query(
    `
    UPDATE loads
    SET status = 'pending'
    WHERE id = $1
    `,
    [trip.load_id]
  );

  await pool.query(
    `
    UPDATE offers
    SET status = 'rejected'
    WHERE id = $1
    `,
    [trip.offer_id]
  );
}

  return trip;
};


// Taşıyıcı olarak benim triplerim
export const getTripsAsCarrier = async (userId) => {
  const result = await pool.query(`
    SELECT
    t.*,
    l.origin_city,
    l.origin_address,
    l.destination_city,
    l.destination_address,
    u.name AS owner_name,
    u.surname AS owner_surname
    FROM trips t
    JOIN loads l ON l.id = t.load_id
    JOIN users u ON u.id = l.owner_id
    WHERE t.carrier_id = $1
    ORDER BY t.created_at DESC
  `, [userId]);

  return result.rows;
};


// Yük sahibi olarak benim triplerim
export const getTripsAsOwner = async (userId) => {
  const result = await pool.query(`
    SELECT
    t.*,
    l.origin_city,
    l.origin_address,
    l.destination_city,
    l.destination_address,
    u.name AS carrier_name,
    u.surname AS carrier_surname
    FROM trips t
    JOIN loads l ON l.id = t.load_id
    JOIN users u ON u.id = t.carrier_id
    WHERE l.owner_id = $1
    ORDER BY t.created_at DESC
  `, [userId]);

  return result.rows;
};