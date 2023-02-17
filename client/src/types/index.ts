import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
} from 'openvidu-browser';
import { Game } from 'phaser';
import { Socket } from 'socket.io-client';

export type Event = React.ChangeEvent<HTMLInputElement>;

export type VoiceProp = {
  roomKey: string;
  userName: string;
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
  showingIcon: any;
  spriteIcon: any;
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
};

export type ServerPlayerType = {
  x: number;
  y: number;
  charKey: string;
  socketId: string;
  state: string;
};
