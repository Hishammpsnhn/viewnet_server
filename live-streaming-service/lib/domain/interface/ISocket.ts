// src/interface/ISocket.ts
export interface ISocket {
    connect(): void;
    emit(event: string, data: any): void;
    on(event: string, callback: (data: any) => void): void;
  }
  