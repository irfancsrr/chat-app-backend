import { Server } from "socket.io";
import http from "http";

let io;
let server;

export function initSocket(app) {
  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "https://chat-app-frontend-roan-nine.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return { io, server };
}
