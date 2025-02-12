// src/infrastructure/SocketIOAdapter.ts
import { Server } from "socket.io";
import { ISocket } from "../../domain/interface/ISocket";


export class SocketIOAdapter implements ISocket {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*", 
      },
    });
  }

  connect(): void {
    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  emit(event: string, data: any): void {
    this.io.emit(event, data); 
  }

  on(event: string, callback: (data: any) => void): void {
    this.io.on(event, callback);
  }
}
