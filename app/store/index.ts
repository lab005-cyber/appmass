import { Platform } from 'react-native';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

const isWeb = Platform.OS === 'web';
let savedOnboarding = false;
if (isWeb) {
  try {
    savedOnboarding = window.localStorage.getItem('onboardingComplete') === 'true';
  } catch {}
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  preloadedState: {
    ui: {
      theme: 'light' as const,
      onboardingComplete: savedOnboarding,
      splashDone: false,
      modals: {},
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
