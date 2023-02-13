import { Session } from 'openvidu-node-client';
import { ROOM_TYPE } from '../constants';

export type RoomType = keyof typeof ROOM_TYPE;

//VoiceSessionList : {SessionId: 세션}
export type SessionList = Record<string, Session>;

//VoiceRoomList : {RoomKey : SessionId}
export type RoomList = Record<string, string>;
