import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';
import { PlayerType } from 'types';
export interface ChatState {
  users: PlayerType[];
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
      const targetId = action.payload;
      state.users = state.users.filter((item) => item.id !== targetId);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsers, addUser, removeUser } = chatSlice.actions;

export default chatSlice.reducer;
