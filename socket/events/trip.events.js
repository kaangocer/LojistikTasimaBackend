export default function registerTripEvents(io, socket) {

  socket.on("join_trip", (tripId) => {
    socket.join(tripId);

    console.log(`📦 Trip odasına katıldı: ${tripId}`);

    socket.emit("joined_trip", {
      tripId,
      message: "Odaya giriş başarılı"
    });
  });

}