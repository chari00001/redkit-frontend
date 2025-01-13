import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import postsReducer from "./features/postsSlice";
import commentsReducer from "./features/commentsSlice";
import communitiesReducer from "./features/communitiesSlice";
import interactionsReducer from "./features/interactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    communities: communitiesReducer,
    interactions: interactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
