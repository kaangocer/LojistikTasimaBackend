import express from "express";
import dotenv from "dotenv";
import http from "http";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import loadRoutes from "./routes/load.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import userRoutes from "./routes/user.routes.js";
import vehicleDataRoutes from "./routes/vehicleData.routes.js";
import tripMessagesRoutes from "./routes/tripMessages.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();

app.use(express.json());

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/loads", loadRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicle-data", vehicleDataRoutes);
app.use("/api/trips", tripMessagesRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/notifications", notificationRoutes);
/* HTTP SERVER */

const server = http.createServer(app);

/* SOCKET INIT */

initSocket(server);

/* PORT */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});