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

//[id, idx, userName, socketId]
export type TableType = [number, number, string, string];

//{닉네임 : 캐릭터} 타입
export type CharInfoType = Record<string, string>;
