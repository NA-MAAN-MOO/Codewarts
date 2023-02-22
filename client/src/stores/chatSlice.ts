import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';
import { CharInfoType } from 'types';

export interface ChatState {
  users: CharInfoType[];
  sessionIdNow: string;
}

const initialState: ChatState = {
  users: [],
  sessionIdNow: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSession: (state, action) => {
      state.sessionIdNow = action.payload;
    },
    removeSession: (state) => {
      state.sessionIdNow = '';
    },
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
export const { setUsers, setSession, removeSession } = chatSlice.actions;

export default chatSlice.reducer;
