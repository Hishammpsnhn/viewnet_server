import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { NotificationSender } from "../domain/interface/NotificationSender";
import WatchTimeService from "../domain/interface/IWatchTime";
interface WatchParty {
  host: string;
  participants: string[];
  videoState: { isPlaying: boolean; currentTime: number };
}
export class WebSocketServer implements NotificationSender {
  private io: SocketServer;
  private connectedUsers: Map<string, Socket> = new Map();
  private watchParties: Map<string, WatchParty> = new Map();

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

      socket.on("register", (userId: string) => {
        this.connectedUsers.set(userId, socket);
        console.log(`User registered: ${userId}`);
      });

      socket.on("update_watch_time", async ({ profileId, watchTime }) => {
        console.log("profile id", profileId, watchTime);
        await WatchTimeService.updateWatchTime(profileId, watchTime);
        socket.emit("watch_time_updated", { status: "success" });
      });

      // Join watch party
      socket.on("joinParty", ({ partyId, profileId }) => {
        console.log("Join party:", partyId, profileId);
        socket.join(partyId);
        if (!this.watchParties.has(partyId)) {
          this.watchParties.set(partyId, {
            host: profileId,
            participants: [profileId],
            videoState: { isPlaying: false, currentTime: 0 },
          });
        } else {
          const party = this.watchParties.get(partyId);
          if (!party) return;
          party.participants.push(profileId);
          this.watchParties.set(partyId, party);
        }
        console.log("watch parteis", this.watchParties);
        this.io.to(partyId).emit("partyUpdate", this.watchParties.get(partyId));
      });

      socket.on("selectedMovie", ({ link, partyId }) => {
        console.log("link", link, partyId);
        this.io.to(partyId).emit("selectedMovie", link);
      });
      socket.on("sync-action", ({ partyId, videoState,time }) => {
        console.log("videioStateUpdate", partyId, videoState,time);
        const party = this.watchParties.get(partyId);
        if (party) {
          party.videoState = videoState;
          this.watchParties.set(partyId, party);
          socket.to(partyId).emit("sync-action", {action:videoState,time});
        }
      });
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
