import { Connection } from 'openvidu-node-client';
import { ROOM_TYPE } from '../constants';

export type RoomType = keyof typeof ROOM_TYPE;

//VoiceRoomList : {RoomKey : SessionId}
export type IsRoomExist = Record<string, Connection>;

//{닉네임 : true/false} 타입
export type MuteInfoType = Record<string, boolean>;
