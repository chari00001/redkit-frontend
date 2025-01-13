import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateNotificationPreferences: (state, action) => {
      state.user.notification_preferences = action.payload;
    },
    updateSubscription: (state, action) => {
      state.user.subscription_level = action.payload.level;
      state.user.subscription_expiration = action.payload.expiration;
    },
  },
});

export const {
  setUser,
  logout,
  setLoading,
  setError,
  updateUserProfile,
  updateNotificationPreferences,
  updateSubscription,
} = authSlice.actions;

export default authSlice.reducer;
