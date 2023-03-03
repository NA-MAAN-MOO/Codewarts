import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import editorReducer from './editorSlice';
import userReducer from './userSlice';
import chatReducer, { fetchMuteInfo } from 'stores/chatSlice';
import rankReducer, { getbojInfos } from 'stores/rankSlice';
import boardReducer from './whiteboardSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    mode: modeReducer,
    editor: editorReducer,
    user: userReducer,
    chat: chatReducer,
    board: boardReducer,
    rank: rankReducer,
  },
});

store.dispatch(fetchMuteInfo());
store.dispatch(getbojInfos());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
