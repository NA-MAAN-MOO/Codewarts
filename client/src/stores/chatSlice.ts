import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';
import { CharInfoType } from 'types';

export interface ChatState {
  users: CharInfoType[];
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
