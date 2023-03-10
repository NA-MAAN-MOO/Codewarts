import { createSlice, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import axios from 'axios';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

export const getbojInfos = createAsyncThunk('rank/getbojInfos', async () => {
  try {
    const response = await axios.get(APPLICATION_DB_URL + '/user-rank');
    return response.data;
  } catch (e) {}
});

export interface BojInfoState {
  nickname: string;
  id: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

interface infosState {
  infos: BojInfoState[] | undefined;
}

const initialState: infosState = {
  infos: [],
};

export const rankSlice = createSlice({
  name: 'rank',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getbojInfos.fulfilled, (state, action) => {
      state.infos = action.payload;
    });
  },
});

export default rankSlice.reducer;
