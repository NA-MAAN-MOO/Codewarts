import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

let now = new Date();
const userId = useSelector((state: RootState) => state.user.playerId);
const userNickname = useSelector(
  (state: RootState) => state.user.playerNickname
);

interface ParticipantType {
  memoId: any;
  userId: string;
  userNickname: string;
  tier: number;
}

export interface MemoState {
  date: Date;
  authorId: string;
  authorNickname: string;
  content: string;
  x: number;
  y: number;
  participants: ParticipantType[];
}

const initialState: MemoState = {
  date: now,
  authorId: userId,
  authorNickname: userNickname,
  content: '',
  x: 80,
  y: 80,
  participants: [],
};

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    addMemo: (state) => {},
    removeMemo: (state) => {},
    editMemo: (state) => {},
    participateIn: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { addMemo, removeMemo, editMemo, participateIn } =
  memoSlice.actions;

export default memoSlice.reducer;
