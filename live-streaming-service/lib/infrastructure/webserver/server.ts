import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import liveStreamRoute from "../../interface/routes/liveStreamingRoutes";

dotenv.config();

// Create a global io instance that can be imported in other files
let ioInstance: SocketIOServer;

const createServer = async () => {
  const app = express();

  const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
;
  app.use("/", liveStreamRoute);

  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:4000", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Store io instance globally
  ioInstance = io;

  const getRoomUserCount = (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room ? room.size : 0;
  };

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Subscribe to notifications
    socket.on("subscribeToNotifications", () => {
      socket.join("notifications");
      console.log(`Client ${socket.id} subscribed to notifications`);
    });

    socket.on("joinRoom", (room) => {
      console.log("join room",room)
      socket.join(room.streamId);
      const userCount = getRoomUserCount(room.streamId);
      io.to(room.streamId).emit("roomUserCount", { 
        roomId: room.streamId, 
        count: userCount 
      });
    });

    socket.on("leaveRoom", ({ streamId, userId }) => {
      socket.leave(streamId);
      const roomUserCount = getRoomUserCount(streamId);
      io.to(streamId).emit("roomUserCount", { 
        roomId: streamId, 
        count: roomUserCount 
      });
    });

    socket.on("sendMessage", (message) => {
      io.to(message.streamId).emit("receiveMessage", message.message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return httpServer;
};



export default createServer;