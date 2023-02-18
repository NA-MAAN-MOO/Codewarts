import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';

export interface ChatState {
  users: Array;
}

const initialState: ChatState = {
  users: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<string>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<string>) => {
      state.users = [...state.users, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsers, addUser } = chatSlice.actions;

export default chatSlice.reducer;
