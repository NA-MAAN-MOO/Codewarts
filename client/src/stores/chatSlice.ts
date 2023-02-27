import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS, MUTE_TYPE } from '../utils/Constants';
import { CharInfoType, MuteInfoType } from 'types';
import { Session } from 'openvidu-browser';
import axios from 'axios';

const APPLICATION_SERVER_URL =
  process.env.REACT_APP_VOICE_URL || 'http://localhost:3002';

export interface ChatState {
  users: CharInfoType[];
  volMuteInfo: MuteInfoType;
  micMuteInfo: MuteInfoType;
  myVolMute: boolean;
  myMicMute: boolean;
}

//유저 뮤트 정보 가져와서 initial state에 넣어둠
export const fetchMuteInfo = createAsyncThunk(
  'char/fetchMuteInfo',
  async () => {
    const { data } = await axios.get(`${APPLICATION_SERVER_URL}/get-mute-info`);
    return data;
  }
);

const initialState: ChatState = {
  users: [], //현재 내가 있는 chat Room의 유저들
  volMuteInfo: {},
  micMuteInfo: {},
  myVolMute: false,
  myMicMute: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    toggleVolMute: (state, action) => {
      const user = action.payload;
      if (!state.volMuteInfo[user]) {
        state.volMuteInfo[user] = true;
      } else {
        state.volMuteInfo[user] = !state.volMuteInfo[user];
      }
    },
    toggleMicMute: (state, action) => {
      const user = action.payload;
      if (!state.micMuteInfo[user]) {
        state.micMuteInfo[user] = true;
      } else {
        state.micMuteInfo[user] = !state.micMuteInfo[user];
      }
    },
    toggleMyVolMute: (state) => {
      state.myVolMute = !state.myVolMute;
    },
    toggleMyMicMute: (state) => {
      state.myMicMute = !state.myMicMute;
    },
    initialMyMute: (state, action) => {
      const me = action.payload;
      console.log(me);
      if (state.volMuteInfo[me]) {
        state.myVolMute = true;
      }
      if (state.micMuteInfo[me]) {
        state.myMicMute = true;
      }
    },
    // setSession: (state, action) => {
    //   const serializedSession = JSON.stringify(action.payload);
    //   state.sessionNow = serializedSession;
    // },
    // getSession: (state) => {
    //   if (!state.sessionNow) return undefined;
    //   const parsedSession = JSON.parse(state.sessionNow);
    //   return parsedSession;
    // },
    // removeSession: (state) => {
    //   state.sessionIdNow = '';
    // },
    // addUser: (state, action) => {
    //   state.users = [...state.users, action.payload];
    // },
    // removeUser: (state, action) => {
    //   const targetName = action.payload;
    //   if (!targetName) return;
    //   state.users = state.users.filter((item) => item !== targetName);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMuteInfo.fulfilled, (state, action) => {
      state.volMuteInfo = action.payload[MUTE_TYPE.VOL];
      state.micMuteInfo = action.payload[MUTE_TYPE.MIC];
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setUsers,
  toggleVolMute,
  toggleMicMute,
  toggleMyVolMute,
  toggleMyMicMute,
  initialMyMute,
} = chatSlice.actions;

export default chatSlice.reducer;
