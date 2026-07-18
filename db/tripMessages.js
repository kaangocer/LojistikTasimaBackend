import pool from "./db.js";

const createTripMessagesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trip_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ trip_messages oluşturuldu");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
};

createTripMessagesTable();