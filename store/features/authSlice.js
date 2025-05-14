import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/apiService";

// Kullanıcı girişi yapma
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Sending login request with:", credentials);
      const response = await userService.login(credentials);
      console.log("Login response from API:", response); // Debug log

      // API yanıtında user ve token var mı kontrol et
      if (!response.user || !response.token) {
        console.error("Invalid API response format:", response);
        return rejectWithValue(
          "Sunucudan geçersiz yanıt alındı. Lütfen daha sonra tekrar deneyin."
        );
      }

      return response;
    } catch (error) {
      console.error("Login error in thunk:", error); // Debug log
      return rejectWithValue(
        error.message || "Giriş yapılırken bir hata oluştu."
      );
    }
  }
);

// Kullanıcı kaydı yapma
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Sending register request with:", userData);
      const response = await userService.register(userData);
      console.log("Register response from API:", response); // Debug log

      // API yanıtında user ve token var mı kontrol et
      if (!response.user || !response.token) {
        console.error("Invalid API response format:", response);
        return rejectWithValue(
          "Sunucudan geçersiz yanıt alındı. Lütfen daha sonra tekrar deneyin."
        );
      }

      return response;
    } catch (error) {
      console.error("Register error in thunk:", error); // Debug log
      return rejectWithValue(error.message || "Kayıt olurken bir hata oluştu.");
    }
  }
);

// Kullanıcı profilini getirme
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile(userId);
      return response.user || response; // Handle both {user: {...}} and direct user object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcı profilini güncelleme
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(userId, userData);
      return response.user || response; // Handle both {user: {...}} and direct user object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LocalStorage'dan mevcut kullanıcı bilgilerini al
const loadState = () => {
  const defaultState = {
    users: [],
    currentUser: null,
    isLoggedIn: false,
    token: null,
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

    return {
      ...parsedState,
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
      // Don't save loading state to localStorage
      loading: false,
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
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.token = null;
      state.loading = false;
      state.error = null;
      saveState(state);

      // LocalStorage'dan token'ı da temizle
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    // Kullanıcı girişi başarılı - userService ile doğrudan giriş için
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      if (user && token) {
        state.currentUser = user;
        state.token = token;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
        saveState(state);
      } else {
        state.error = "Geçersiz kullanıcı verisi veya token.";
      }
    },
    // Kullanıcı kaydı başarılı - userService ile doğrudan kayıt için
    registerSuccess: (state, action) => {
      const { token, user } = action.payload;

      if (user && token) {
        state.currentUser = user;
        state.token = token;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
        saveState(state);
      } else {
        state.error = "Geçersiz kullanıcı verisi veya token.";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // Handle both {user: {...}, token: '...'} and direct object formats
        const user = action.payload.user || null;
        const token = action.payload.token || null;

        if (user && token) {
          state.currentUser = user;
          state.token = token;
          state.isLoggedIn = true;
          state.loading = false;
          state.error = null;
          saveState(state);
        } else {
          state.loading = false;
          state.error = "Invalid response format from server";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // Handle both {user: {...}, token: '...'} and direct object formats
        const user = action.payload.user || null;
        const token = action.payload.token || null;

        if (user && token) {
          state.currentUser = user;
          state.token = token;
          state.isLoggedIn = true;
          state.loading = false;
          state.error = null;
          saveState(state);
        } else {
          state.loading = false;
          state.error = "Invalid response format from server";
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const user = action.payload;

        // Kullanıcı listesinde mevcut kullanıcıyı güncelle
        const userIndex = state.users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          state.users[userIndex] = user;
        } else {
          state.users.push(user);
        }

        // Eğer giriş yapmış kullanıcı ise currentUser'ı da güncelle
        if (state.currentUser && state.currentUser.id === user.id) {
          state.currentUser = user;
        }

        state.loading = false;
        state.error = null;
        saveState(state);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        // Kullanıcı listesinde mevcut kullanıcıyı güncelle
        const userIndex = state.users.findIndex((u) => u.id === updatedUser.id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }

        // Eğer giriş yapmış kullanıcı ise currentUser'ı da güncelle
        if (state.currentUser && state.currentUser.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }

        state.loading = false;
        state.error = null;
        saveState(state);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setLoading,
  setError,
  logoutUser,
  loginSuccess,
  registerSuccess,
} = authSlice.actions;

export default authSlice.reducer;
