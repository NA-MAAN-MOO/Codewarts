import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MainScene from 'scenes/Mainscene';
import Background from 'scenes/Background';
// import { BackgroundMode } from '../../../server/types/BackgroundMode';
import phaserGame from 'codeuk';

export enum BackgroundMode {
  DAY,
  NIGHT,
}

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours();
  return currentHour > 6 && currentHour <= 18
    ? BackgroundMode.DAY
    : BackgroundMode.NIGHT;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    playerId: '',
    playerTexture: 'char0',
    playerNickname: 'Unknown',
    playerBojId: 'Unknown',
    playerLeetId: 'Unknown',
    userLoginId: '',
  },
  reducers: {
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY
          ? BackgroundMode.NIGHT
          : BackgroundMode.DAY;

      state.backgroundMode = newMode;
      const bootstrap = phaserGame.scene.keys.bootstrap as Background;
      bootstrap.changeBackgroundMode(newMode);
    },
    setPlayerBojId: (state, action: PayloadAction<string>) => {
      state.playerBojId = action.payload;
    },
    setPlayerLeetId: (state, action: PayloadAction<string>) => {
      state.playerLeetId = action.payload;
    },
    setPlayerNickname: (state, action: PayloadAction<string>) => {
      state.playerNickname = action.payload;
    },
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setPlayerTexture: (state, action: PayloadAction<string>) => {
      state.playerTexture = action.payload;
    },
    // Login Id
    setUserLoginId: (state, action: PayloadAction<string>) => {
      state.userLoginId = action.payload;
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

export const {
  toggleBackgroundMode,
  setPlayerId,
  setPlayerTexture,
  setPlayerNickname,
  setPlayerLeetId,
  setPlayerBojId,
  setUserLoginId,
} = userSlice.actions;

export default userSlice.reducer;
