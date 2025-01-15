import { createSlice } from "@reduxjs/toolkit";
import { users } from "@/mockData/users";

// LocalStorage'dan mevcut kullanıcı bilgilerini al
const loadState = () => {
  const defaultState = {
    users: users,
    currentUser: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  };

  // Server-side rendering kontrolü
  if (typeof window === "undefined") {
    return defaultState;
  }

  // Client-side'da localStorage'dan state'i yükle
  try {
    const serializedState = localStorage.getItem("authState");
    if (!serializedState) {
      return defaultState;
    }

    const parsedState = JSON.parse(serializedState);

    // Mevcut kullanıcıları birleştir ve tekrarları önle
    const mergedUsers = [
      ...users,
      ...parsedState.users.filter(
        (u) => !users.find((defaultUser) => defaultUser.id === u.id)
      ),
    ];

    return {
      ...parsedState,
      users: mergedUsers,
      // Date.now() gibi değişken değerleri temizle
      currentUser: parsedState.currentUser
        ? {
            ...parsedState.currentUser,
            lastLoginAt: undefined, // Değişken zaman değerlerini kaldır
          }
        : null,
    };
  } catch (err) {
    console.error("LocalStorage yüklenirken hata:", err);
    return defaultState;
  }
};

// Sabit bir başlangıç state'i oluştur
const initialState = loadState();

// LocalStorage'a state'i kaydet (client-side only)
const saveState = (state) => {
  if (typeof window === "undefined") return;

  try {
    const stateToSave = {
      ...state,
      // Değişken değerleri temizle
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            lastLoginAt: undefined,
          }
        : null,
    };

    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem("authState", serializedState);
  } catch (err) {
    console.error("LocalStorage kaydedilirken hata:", err);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
      saveState(state);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      saveState(state);
    },
    registerUser: (state, action) => {
      const newUser = {
        id: String(Date.now()), // String'e çevir
        ...action.payload,
        profile_picture_url: `https://i.pravatar.cc/300?u=${Date.now()}`,
        createdAt: new Date().toISOString(), // ISO string formatında sakla
      };
      state.users.push(newUser);
      state.currentUser = newUser;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
      saveState(state);
    },
    loginUser: (state, action) => {
      const user = state.users.find(
        (u) =>
          u.email === action.payload.email &&
          u.password === action.payload.password
      );
      if (user) {
        state.currentUser = {
          ...user,
          lastLoginAt: new Date().toISOString(), // ISO string formatında sakla
        };
        state.isLoggedIn = true;
        state.error = null;
      } else {
        state.error = "Geçersiz e-posta veya parola";
      }
      state.loading = false;
      saveState(state);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      saveState(state);
    },
    updateUserData: (state, action) => {
      const { userId, data } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = {
          ...state.users[userIndex],
          ...data,
          updatedAt: new Date().toISOString(), // ISO string formatında sakla
        };
        if (state.currentUser?.id === userId) {
          state.currentUser = {
            ...state.currentUser,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
      }
      saveState(state);
    },
  },
});

export const {
  setLoading,
  setError,
  registerUser,
  loginUser,
  logoutUser,
  updateUserData,
} = authSlice.actions;

export default authSlice.reducer;
