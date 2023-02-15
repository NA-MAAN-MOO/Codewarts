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

export type SessionEvent =
  | 'connectionCreated'
  | 'connectionDestroyed'
  | 'connectionPropertyChanged'
  | 'exception'
  | 'networkQualityLevelChanged'
  | 'publisherStartSpeaking'
  | 'publisherStopSpeaking'
  | 'reconnected'
  | 'reconnecting'
  | 'recordingStarted'
  | 'recordingStopped'
  | 'sessionDisconnected'
  | 'signal'
  | 'speechToTextMessage'
  | 'streamCreated'
  | 'streamDestroyed'
  | 'streamPropertyChanged';

export type VoiceProp = {
  roomKey: string;
  userName: string;
};

export type SessionInfo = {
  OV: OpenVidu;
  session: Session;
  sessionId: string;
};

export type PhaserGame = Game & {
  socket?: Socket;
  socketId?: string;
  charKey?: string;
  userName?: string;
};
