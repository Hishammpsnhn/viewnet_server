// src/domain/ChatMessage.ts
export class ChatMessage {
    sender: string;
    content: string;
    timestamp: Date;
  
    constructor(sender: string, content: string, timestamp: Date = new Date()) {
      this.sender = sender;
      this.content = content;
      this.timestamp = timestamp;
    }
  }
  