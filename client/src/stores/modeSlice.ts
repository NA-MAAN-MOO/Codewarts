import { createSlice } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';

export interface ModeState {
  status: string;
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
    openWhiteboard: (state) => {
      state.status = GAME_STATUS.WHITEBOARD;
    },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const { openStart, openGame, openEditor, openLobby, openWhiteboard } =
  modeSlice.actions;

export default modeSlice.reducer;
