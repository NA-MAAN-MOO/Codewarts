import dotenv from 'dotenv';
//환경변수 이용(코드 최상단에 위치시킬 것)
dotenv.config();

export const ROOM_TYPE = {
  GAME: 'GAME',
  EDITOR: 'EDITOR',
};
export const MUTE_TYPE = {
  VOL: 'GET_VOL',
  MIC: 'GET_MIC',
  SET_VOL: 'SET_VOL',
  SET_MIC: 'SET_MIC',
};

export const CONFIG = {
  EDITOR_URL: process.env.EDITOR_URL || 'http://localhost:3001',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
  OPENVIDU_URL: process.env.OPENVIDU_URL || 'http://localhost:4443',
  OPENVIDU_SECRET: process.env.OPENVIDU_SECRET || 'MY_SECRET',
  PORT: process.env.PORT || 8080, // SOCKET.IO 포트
  MONGO_URL: process.env.MONGO_URL,
  JDOODLE_CLIENT_ID: process.env.JDOODLE_CLIENT_ID,
  JDOODLE_CLIENT_SECRET: process.env.JDOODLE_CLIENT_SECRET,
};
