import { ROOM_TYPE } from 'utils/Constants';
import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
} from 'openvidu-browser';
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
};

export type VoiceInfo = {
  VoiceRoomList: Record<string, string>;
  VoiceSessionInfo: Record<
    string,
    {
      OV: OpenVidu;
      session: Session;
      mySessionId: string;
      myUserName: string;
    }
  >;
};
