import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';
import { Connection } from 'openvidu-browser';

export interface ChatState {
  users: Connection[];
}

const initialState: ChatState = {
  users: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    removeUser: (state, action) => {
      const targetName = action.payload;
      if (!targetName) return;
      state.users = state.users.filter((item) => item !== targetName);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsers, addUser, removeUser } = chatSlice.actions;

export default chatSlice.reducer;
