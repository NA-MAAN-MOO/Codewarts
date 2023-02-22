import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import editorReducer from './editorSlice';
import userReducer from './userSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    mode: modeReducer,
    editor: editorReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
