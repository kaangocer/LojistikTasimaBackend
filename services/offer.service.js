import pool from "../db/db.js";


// 1️⃣ Teklif oluştur
export const createOffer = async ({
  loadId,
  carrierId,
  vehicleId,
  offerPrice,
  estimatedPickup,
  estimatedDelivery,
  message
}) => {

  // 1️⃣ Yük kontrol
  const loadCheck = await pool.query(
    "SELECT owner_id FROM loads WHERE id = $1",
    [loadId]
  );

  if (loadCheck.rows.length === 0) {
    throw new Error("Yük bulunamadı");
  }

  if (loadCheck.rows[0].owner_id === carrierId) {
    throw new Error("Kendi yükünüze teklif veremezsiniz");
  }

  // 2️⃣ Daha önce teklif verilmiş mi
  const existingOffer = await pool.query(
  `
  SELECT id
  FROM offers
  WHERE load_id = $1
  AND carrier_id = $2
  AND status IN ('pending','accepted')
  `,
  [loadId, carrierId]
);

  if (existingOffer.rows.length > 0) {
    throw new Error("Bu yüke zaten teklif verdiniz");
  }

  // 3️⃣ Teklif oluştur
  const result = await pool.query(
    `
    INSERT INTO offers (
      load_id,
      carrier_id,
      vehicle_id,
      offer_price,
      estimated_pickup,
      estimated_delivery,
      message
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      loadId,
      carrierId,
      vehicleId,
      offerPrice,
      estimatedPickup,
      estimatedDelivery,
      message
    ]
  );

  return result.rows[0];
};


// 2️⃣ Kullanıcının VERDİĞİ teklifler
export const getOffersGivenByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      o.*,

      l.origin_city,
      l.origin_address,
      l.destination_city,
      l.destination_address,
      l.pickup_time,
      l.delivery_time,
      l.tonnage,
      l.quantity,
      l.quantity_unit,
      l.volume_m3,
      l.fuel_included,
      l.description,

      v.brand,
      v.model,
      v.year,

      u.name,
      u.surname

    FROM offers o

    JOIN loads l 
      ON l.id = o.load_id

    LEFT JOIN vehicles v 
      ON v.id = o.vehicle_id

    LEFT JOIN users u 
      ON u.id = o.carrier_id

    WHERE o.carrier_id = $1

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

// 3️⃣ Kullanıcının ALDIĞI teklifler (kendi yüklerine gelen)
export const getOffersReceivedByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      o.*,

      l.origin_city,
      l.origin_address,
      l.destination_city,
      l.destination_address,
      l.pickup_time,
      l.delivery_time,
      l.tonnage,
      l.quantity,
      l.quantity_unit,
      l.volume_m3,
      l.fuel_included,
      l.description,

      v.brand,
      v.model,
      v.year,

      u.name,
      u.surname

    FROM offers o

    JOIN loads l 
      ON l.id = o.load_id

    LEFT JOIN vehicles v 
      ON v.id = o.vehicle_id

    JOIN users u 
      ON u.id = o.carrier_id

    WHERE l.owner_id = $1

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

// 4️⃣ Admin → tüm teklifler
export const getAllOffers = async () => {
  const result = await pool.query(
    `
    SELECT o.*, l.origin_city, l.destination_city
    FROM offers o
    JOIN loads l ON l.id = o.load_id
    ORDER BY o.created_at DESC
    `
  );
  return result.rows;
};



export const acceptOffer = async (offerId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Teklif + yük bilgisi
    const offerRes = await client.query(
      `
      SELECT 
        o.id AS offer_id,
        o.status AS offer_status,
        o.load_id,
        o.carrier_id,
        o.vehicle_id,
        l.owner_id,
        l.delivery_time
      FROM offers o
      JOIN loads l ON l.id = o.load_id
      WHERE o.id = $1
      FOR UPDATE
      `,
      [offerId]
    );

    if (offerRes.rows.length === 0) {
      throw new Error("Teklif bulunamadı");
    }

    const offer = offerRes.rows[0];

    // 2️⃣ Yük sahibi mi?
    if (offer.owner_id !== userId) {
      throw new Error("Bu teklifi kabul etme yetkiniz yok");
    }

    // 3️⃣ Kendi teklifini kabul edemez
    if (offer.carrier_id === userId) {
      throw new Error("Kendi teklifinizi kabul edemezsiniz");
    }

    // 4️⃣ Teklif zaten kabul edilmiş mi?
    if (offer.offer_status === "accepted") {
      throw new Error("Bu teklif zaten kabul edilmiş");
    }

    // 5️⃣ Aynı yüke ait başka kabul edilmiş teklif var mı?
    const acceptedCheck = await client.query(
      `
      SELECT id
      FROM offers
      WHERE load_id = $1 AND status = 'accepted'
      `,
      [offer.load_id]
    );

    if (acceptedCheck.rows.length > 0) {
      throw new Error("Bu yük için zaten kabul edilmiş bir teklif var");
    }

    // 6️⃣ Teklifi kabul et
    await client.query(
      `UPDATE offers SET status = 'accepted' WHERE id = $1`,
      [offerId]
    );

    // 7️⃣ Diğer teklifleri reddet
    await client.query(
      `
      UPDATE offers
      SET status = 'rejected'
      WHERE load_id = $1 AND id != $2
      `,
      [offer.load_id, offerId]
    );
    await client.query(
  `
  UPDATE loads
  SET status = 'accepted'
  WHERE id = $1
  `,
  [offer.load_id]
);

    // 8️⃣ Trip oluştur
    const tripRes = await client.query(
  `
  INSERT INTO trips
  (load_id, offer_id, carrier_id, vehicle_id, start_time, end_time, status)
  VALUES ($1,$2,$3,$4,NOW(),$5,'accepted')
  RETURNING *
  `,
  [
    offer.load_id,
    offer.offer_id,
    offer.carrier_id,
    offer.vehicle_id,
    offer.delivery_time
  ]
);

    await client.query("COMMIT");
    return tripRes.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//TEKLİFİ REDDET
export const rejectOffer = async (offerId, userId) => {
  const result = await pool.query(
    `
    UPDATE offers o
    SET status = 'rejected'

    FROM loads l

    WHERE 
      o.load_id = l.id
      AND o.id = $1
      AND l.owner_id = $2
      AND o.status = 'pending'

    RETURNING o.*
    `,
    [offerId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Teklif reddedilemedi");
  }

  return result.rows[0];
};