import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  onboardingComplete: boolean;
  splashDone: boolean;
  modals: Record<string, boolean>;
}

const initialState: UIState = {
  theme: 'light',
  onboardingComplete: false,
  splashDone: false,
  modals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    completeOnboarding: (state) => {
      state.onboardingComplete = true;
    },
    setSplashDone: (state) => {
      state.splashDone = true;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
  },
});

export const { toggleTheme, completeOnboarding, setSplashDone, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
