export const GAME_STATUS = {
  START: 'START',
  LOBBY: 'LOBBY',
  GAME: 'GAME',
  EDITOR: 'EDITOR',
  WHITEBOARD: 'WHITEBOARD',
};

export const MUTE_TYPE = {
  VOL: 'GET_VOL',
  MIC: 'GET_MIC',
  SET_VOL: 'SET_VOL',
  SET_MIC: 'SET_MIC',
};

export const VOICE_STATUS = {
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
  FAIL: 'FAIL',
};

export const APPLICATION_URL = {
  APPLICATION_VOICE_URL: process.env.REACT_APP_SERVER_URL
    ? `${process.env.REACT_APP_SERVER_URL}/voice`
    : 'http://localhost:3002',
  APPLICATION_DB_URL: process.env.REACT_APP_DB_URL || 'http://localhost:3003',
  APPLICATION_EDITOR_URL:
    process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001',
  APPLICATION_SERVER_URL:
    process.env.REACT_APP_SERVER_URL || 'http://localhost:8080',
  APPLICATION_BOARD_URL:
    process.env.REACT_APP_SERVER_URL || 'http://localhost:3004',
  APPLICATION_YJS_URL: process.env.REACT_APP_YJS_URL || 'ws://localhost:1234/',
};
