import { Server } from "socket.io";
import registerTripEvents from "./events/trip.events.js";
import registerChatEvents from "./events/chat.events.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Kullanıcı bağlandı");

    registerTripEvents(io, socket);
    registerChatEvents(io, socket);
  });
};

export { io };