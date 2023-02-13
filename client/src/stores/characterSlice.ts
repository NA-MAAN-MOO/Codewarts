import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CharactorState {
  nickName: String;
  charactorModel: String;
}

const initialState: CharactorState = {
  nickName: '',
  charactorModel: 'char1',
};

export const charactorSlice = createSlice({
  name: 'charactor',
  initialState,
  reducers: {
    setNickName: (state, action: PayloadAction<string>) => {
      state.nickName = action.payload;
    },
    setCharactorModel: (state, action: PayloadAction<string>) => {
      state.charactorModel = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNickName, setCharactorModel } = charactorSlice.actions;

export default charactorSlice.reducer;
