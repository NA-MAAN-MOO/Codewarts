import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';
import { CharInfoType } from 'types';
import { Session } from 'openvidu-browser';

export interface ChatState {
  users: CharInfoType[];
  // sessionIdNow: string;
  // sessionNow: string;
}

const initialState: ChatState = {
  users: [],
  // sessionIdNow: '',
  // sessionNow: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
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
});

// Action creators are generated for each case reducer function
export const { setUsers } = chatSlice.actions;

export default chatSlice.reducer;
