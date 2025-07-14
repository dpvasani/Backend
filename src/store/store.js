import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import videoSlice from './slices/videoSlice';
import userSlice from './slices/userSlice';
import tweetSlice from './slices/tweetSlice';
import subscriptionSlice from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
    user: userSlice,
    tweet: tweetSlice,
    subscription: subscriptionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;