import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GAME_STATUS } from "../utils/Constants";

export interface ModeState {
  status: String;
}

const initialState: ModeState = {
  status: GAME_STATUS.MAIN,
};

export const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    openMain: (state) => {
      state.status = GAME_STATUS.MAIN;
    },
    openGame: (state) => {
      state.status = GAME_STATUS.GAME;
    },
    openEditor: (state) => {
      state.status = GAME_STATUS.EDITOR;
    },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const { openMain, openGame, openEditor } = modeSlice.actions;

export default modeSlice.reducer;
