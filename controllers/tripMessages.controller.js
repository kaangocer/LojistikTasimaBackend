import pool from "../db/db.js";

export const getTripMessages = async (req, res) => {
  try {
    const { tripId } = req.params;

    const result = await pool.query(
      `
      SELECT
        tm.id,
        tm.message,
        tm.created_at,
        tm.sender_id,
        u.name,
        u.surname
      FROM trip_messages tm
      JOIN users u
        ON u.id = tm.sender_id
      WHERE tm.trip_id = $1
      ORDER BY tm.created_at ASC
      `,
      [tripId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Mesajlar getirilemedi"
    });
  }
};