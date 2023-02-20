import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
  Publisher,
} from 'openvidu-browser';
import { Game } from 'phaser';
import { Socket } from 'socket.io-client';

export type Event = React.ChangeEvent<HTMLInputElement>;

export type VoiceProp = {
  roomKey: string;
};

export type GameType = Game & {
  socket?: Socket;
  socketId?: string;
  charKey?: string;
  userName?: string;
};

export interface PlayerInterface {
  socketId: string;
  playerTexture: string;
  touching: any[];
  inputKeys: any;
  buttonEditor: any;
}

export type PlayerType = {
  x: number;
  y: number;
  scene: Phaser.Scene;
  texture: string;
  id: string;
  frame?: string;
  state?: string;
  name: string;
};

export type ServerPlayerType = {
  x: number;
  y: number;
  charKey: string;
  socketId: string;
  state: string;
  userName: string;
};

export type MotionType = {
  socketId: string;
  x: number;
  y: number;
  motion: string;
};
export type GameVoiceType = {
  session: Session | undefined;
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
  leaveSession: () => void;
  joinSession: () => void;
};
