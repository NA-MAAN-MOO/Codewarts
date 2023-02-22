import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';

export interface EditorState {
  userName: string;
  roomId: string;
}

const initialState: EditorState = {
  userName: '',
  roomId: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserName, setRoomId } = editorSlice.actions;

export default editorSlice.reducer;
