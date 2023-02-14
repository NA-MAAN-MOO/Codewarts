import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    playerId: '',
    playerTexture: 'char0',
  },
  reducers: {
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setPlayerTexture: (state, action: PayloadAction<string>) => {
      state.playerTexture = action.payload;
    },
    // setVideoConnected: (state, action: PayloadAction<boolean>) => {
    //   state.videoConnected = action.payload;
    // },  여기서 groupcall 연결하면 좋겠다
    // setLoggedIn: (state, action: PayloadAction<boolean>) => {
    //   state.loggedIn = action.payload;
    // },  우리는 로그인상태를 알고있나?
    // setPlayerNameMap: (
    //   state,
    //   action: PayloadAction<{ id: string; name: string }>
    // ) => {
    //   state.playerNameMap.set(
    //     sanitizeId(action.payload.id),
    //     action.payload.name
    //   );
    // },  우린 이름이 곧 아이디라 필요없음
  },
});

export const { setPlayerId, setPlayerTexture } = userSlice.actions;

export default userSlice.reducer;
