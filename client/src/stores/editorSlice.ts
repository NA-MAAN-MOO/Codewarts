import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GAME_STATUS } from '../utils/Constants';

export interface EditorState {
  userName: string;
  editorName: string;
}

const initialState: EditorState = {
  userName: '',
  editorName: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setEditorName: (state, action: PayloadAction<string>) => {
      state.editorName = action.payload;
    },
    resetEditorName: (state) => {
      state.editorName = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserName, setEditorName, resetEditorName } =
  editorSlice.actions;

export default editorSlice.reducer;
