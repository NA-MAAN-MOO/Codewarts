import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

let now = new Date();
const userId = useSelector((state: RootState) => state.user.playerId);
const userNickname = useSelector(
  (state: RootState) => state.user.playerNickname
);

let allMemos: MemoState[] = [];

interface ParticipantType {
  memoId: any;
  userId: string;
  userNickname: string;
  tier: number;
}

export interface MemoState {
  _id: any;
  date: Date;
  authorId: string;
  authorNickname: string;
  content: string;
  x: number;
  y: number;
  participants: ParticipantType[];
}

const initialState: MemoState = {
  _id: '',
  date: now,
  authorId: userId,
  authorNickname: userNickname,
  content: '',
  x: 80,
  y: 80,
  participants: [],
};
// FIXME: Memos 만들기

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    removeMemo: (state, action: PayloadAction<string>) => {},
    editMemo: (state, action: PayloadAction<string>) => {},
    participateIn: (state, action: PayloadAction<string>) => {},
  },
});

export const zIndexSlice = createSlice({
  name: 'zIndex',
  initialState: 0,
  reducers: {
    setMaxZIndex: (state) => {
      state++;
    },
  },
});

// Action creators are generated for each case reducer function
export const { removeMemo, editMemo, participateIn } = memoSlice.actions;

export const { setMaxZIndex } = zIndexSlice.actions;

export default memoSlice.reducer;
