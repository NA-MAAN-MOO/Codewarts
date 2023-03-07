import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isChecked: false,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    toggleWhiteboard: (state) => {
      state.isChecked = !state.isChecked;
    },
    turnWhiteboardOff: (state) => {
      state.isChecked = false;
    },
  },
});

export const { toggleWhiteboard, turnWhiteboardOff } = boardSlice.actions;

export default boardSlice.reducer;
