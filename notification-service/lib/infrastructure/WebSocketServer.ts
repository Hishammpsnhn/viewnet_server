import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { NotificationSender } from "../domain/interface/NotificationSender";

export class WebSocketServer implements NotificationSender {
  private io: SocketServer;
  private connectedUsers: Map<string, Socket> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.id);

      // Register user ID and store the socket
      socket.on("register", (userId: string) => {
        this.connectedUsers.set(userId, socket);
        console.log(`User registered: ${userId}`);
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        this.connectedUsers.forEach((value, key) => {
          if (value === socket) this.connectedUsers.delete(key);
        });
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  // Send notification to all connected users
  sendNotification(eventType: string, message: string): void {
    this.connectedUsers.forEach((socket) => {
      socket.emit("notification", { eventType, message });
    });
  }
}
