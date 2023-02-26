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
import { WebsocketProvider } from 'y-websocket';

export type Event = React.ChangeEvent<HTMLInputElement>;

export type VoiceProp = {
  session: Session | undefined;
  handleSession: (session?: Session | undefined) => void;
  roomKey: string;
  handleDrawerClose?: () => void;
  handleSocket?: (soc: Socket) => void;
};

export type YjsProp = {
  handleProvider?: (pro: WebsocketProvider) => void;
  provider?: WebsocketProvider;
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
  playerCollider: boolean;
};

export type ServerPlayerType = {
  x: number;
  y: number;
  charKey: string;
  socketId: string;
  state: string;
  userName: string;
  playerCollider: boolean;
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

export type Connection = {
  id: string;
  object: string;
  type: string;
  status: string;
  sessionId: string;
  createdAt: number;
  activeAt: number;
  location: string;
  ip: string;
  platform: string;
  token: string;
  serverData: string;
  clientData: string;
  record: boolean;
  role: string;
  kurentoOptions: object;
  customIceServers: {
    url: string;
    username?: string;
    credential?: string;
  }[];
  rtspUri: string;
  adaptativeBitrate: boolean;
  onlyPlayWithSubscribers: boolean;
  networkCache: number;
  publishers: {
    streamId: string;
    createdAt: number;
    mediaOptions: {
      hasVideo: boolean;
      hasAudio: boolean;
      videoActive: boolean;
      audioActive: boolean;
      frameRate: number;
      videoDimensions: string;
      typeOfVideo: string;
      filter: object;
    };
  }[];
  subscribers: {
    streamId: string;
    createdAt: number;
  }[];
};

//{닉네임 : 캐릭터} 타입
export type CharInfoType = Record<string, string>;

//{닉네임 : true/false} 타입
export type MuteInfoType = Record<string, boolean>;
