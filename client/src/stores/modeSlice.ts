import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';

export interface ModeState {
  status: String;
}

const initialState: ModeState = {
  status: GAME_STATUS.START,
};

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    openStart: (state) => {
      state.status = GAME_STATUS.START;
    },
    openGame: (state) => {
      state.status = GAME_STATUS.GAME;
    },
    openEditor: (state) => {
      state.status = GAME_STATUS.EDITOR;
    },
    openLobby: (state) => {
      state.status = GAME_STATUS.LOBBY;
    },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const { openStart, openGame, openEditor, openLobby } = modeSlice.actions;

export default modeSlice.reducer;
