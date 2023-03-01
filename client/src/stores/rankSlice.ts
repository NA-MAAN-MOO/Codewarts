import { createSlice, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import axios from 'axios';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

const getEachUserBojInfo = async (bojId: string) => {
  try {
    const data = await axios.get(
      `https://solved.ac/api/v3/user/show?handle=${bojId}`
    );
    // console.log(data.data);
    return data.data;
  } catch (e) {
    return false;
  }
};

const regenerateData = async (datum: any) => {
  let result = [];
  for await (const data of datum) {
    const eachData: any = await getEachUserBojInfo(data.userBojId);

    if (!!eachData) {
      result.push({
        nickname: data.userNickname,
        id: data.userId,
        bojId: data.userBojId,
        tier: eachData.tier,
        maxStreak: eachData.maxStreak,
        solved: eachData.solvedCount,
      });
    }
  }
  return result;
};

export const getbojInfos = createAsyncThunk('rank/getbojInfos', async () => {
  try {
    const response = await axios.get(APPLICATION_DB_URL + '/user-infos');
    const bojInfos = await regenerateData(response.data); //.data 붙이고 await 붙이는 거 중요함 ...
    return bojInfos;
  } catch (e) {
    // console.error(e);
  }
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
