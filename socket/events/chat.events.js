import pool from "../../db/db.js";

export default function registerChatEvents(io, socket) {

  socket.on("join_trip", (tripId) => {
    console.log("JOIN ROOM:", tripId);

    socket.join(String(tripId));
  });

  socket.on("send_message", async (data) => {
  try {

    const {
      tripId,
      senderId,
      senderName,
      message
    } = data;

    const tripResult = await pool.query(
      `
      SELECT
        t.carrier_id,
        l.owner_id
      FROM trips t
      JOIN loads l ON l.id = t.load_id
      WHERE t.id = $1
      `,
      [tripId]
    );

    const trip = tripResult.rows[0];

    const receiverId =
      trip.carrier_id === senderId
        ? trip.owner_id
        : trip.carrier_id;

    await pool.query(
      `
      INSERT INTO notifications
      (user_id, title, message, trip_id)
      VALUES ($1, $2, $3, $4)
      `,
      [
        receiverId,
        "Yeni Mesaj",
        `${senderName} size mesaj gönderdi`,
        tripId
      ]
    );

    await pool.query(
      `
      INSERT INTO trip_messages
      (trip_id, sender_id, message)
      VALUES ($1,$2,$3)
      `,
      [
        tripId,
        senderId,
        message
      ]
    );

    io.to(String(tripId)).emit("receive_message", {
      senderId,
      senderName,
      message,
      time: new Date()
    });

    io.to(String(receiverId)).emit("new_notification", {
      tripId,
      senderId,
      senderName,
      message,
      time: new Date()
    });

  } catch (err) {
    console.log("CHAT INSERT ERROR:", err);
  }
});

}