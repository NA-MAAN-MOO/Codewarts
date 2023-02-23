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
  },
});

export const { toggleWhiteboard } = boardSlice.actions;

export default boardSlice.reducer;
