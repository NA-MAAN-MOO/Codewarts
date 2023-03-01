import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import axios from 'axios';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

const getEachUserBojInfo = async (bojId: string) => {
  try {
    return await axios.get(
      `https://solved.ac/api/v3/user/show?handle=${bojId}`
    );
  } catch (e) {
    return false;
  }
};

const regenerateData = async (datum: any) => {
  let result = [];
  for (const data of datum) {
    const eachData: any = await getEachUserBojInfo(data.userBojId);

    if (!!eachData) {
      result.push({
        nickname: data.userNickname,
        id: data.userId,
        bojId: data.userBojId,
        tier: eachData.data.tier,
        maxStreak: eachData.data.maxStreak,
        solved: eachData.data.solvedCount,
      });
    }
  }
};

export interface BojInfoState {
  nickname: string;
  id: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

const initialState: BojInfoState[] = [];
// FIXME: Memos 만들기

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    // getbojInfos: (state) => {
    //   try {
    //     const response = await axios.get(APPLICATION_DB_URL + '/boj-infos');
    //     const bojInfo = regenerateData(response.data);
    //     state.push(bojInfo);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
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
// export const { removeMemo, editMemo, participateIn } = memoSlice.actions;

export const { setMaxZIndex } = zIndexSlice.actions;

export default memoSlice.reducer;
