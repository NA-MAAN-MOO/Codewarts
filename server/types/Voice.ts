import { ROOM_TYPE } from '../constants';

export type RoomType = keyof typeof ROOM_TYPE;

//VoiceRoomList : {RoomKey : SessionId}
export type IsRoomExist = Record<string, boolean>;