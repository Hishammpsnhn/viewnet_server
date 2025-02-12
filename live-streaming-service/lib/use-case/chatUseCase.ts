import { ChatMessage } from "../domain/entity/ChatMessage";
import { ISocket } from "../domain/interface/ISocket";

export class ChatUseCase {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  broadcastMessage(message: ChatMessage): void {
    this.socket.emit("chatMessage", message); // Broadcast the message
  }

  listenForMessages(callback: (message: ChatMessage) => void): void {
    this.socket.on("clientMessage", (data) => {
      const message = new ChatMessage(data.sender, data.content);
      callback(message);
    });
  }
}
