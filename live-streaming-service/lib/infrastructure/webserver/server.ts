import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; // Import HTTP to create a server for Socket.IO
import { Server as SocketIOServer } from "socket.io";
import liveStreamRoute from "../../interface/routes/liveStreamingRoutes";

dotenv.config();

const createServer = async () => {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/", liveStreamRoute);

  // Create an HTTP server to integrate with Socket.IO
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:4000", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  const getRoomUserCount = (roomId:string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room ? room.size : 0; // `room.size` gives the count of users in the room
  };

  // Socket.IO event handling
  io.on("connection", (socket) => {
    console.log("Client connected1:", socket.id);

    // Handle custom events
    socket.on("joinRoom", (room) => {
      console.log("joind room")

      socket.join(room.streamId);
      const userCount = getRoomUserCount(room.streamId);
      console.log(`Number of users in room ${room.streamId}: ${userCount}`);

      io.to(room.streamId).emit("roomUserCount", { roomId: room.streamId, count: userCount });
      console.log(`Client ${socket.id} joined room: ${room.streamId}`);
    });

    socket.on("leaveRoom", ({ streamId, userId }) => {
      socket.leave(streamId);
      console.log(`Client ${socket.id} left room: ${streamId}`);
  
      // Update user count in the room
      const roomUserCount = io.sockets.adapter.rooms.get(streamId)?.size || 0;
      io.to(streamId).emit("roomUserCount", { roomId: streamId, count: roomUserCount });
    });

    socket.on("sendMessage", (message) => {
      console.log("Received message:", message);
      // Broadcast the message to all clients in the same room
      io.to(message.streamId).emit("receiveMessage", message.message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return httpServer; // Return the HTTP server
};

export default createServer;
