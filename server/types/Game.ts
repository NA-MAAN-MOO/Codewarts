import { Socket } from 'socket.io';

export type PlayerType = {
  socket: Socket;
  socketId: string;
  charKey: string;
  userName: string;
  state: 'resume' | 'paused';
  x: number;
  y: number;
};

export type TableType = [number, number, string];
