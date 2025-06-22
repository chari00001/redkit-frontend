import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { communityService } from "@/services/apiService";

// Tüm toplulukları getir
export const fetchAllCommunities = createAsyncThunk(
  "communities/fetchAllCommunities",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await communityService.getAllCommunities(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Topluluk detaylarını getir
export const fetchCommunityById = createAsyncThunk(
  "communities/fetchCommunityById",
  async (communityId, { rejectWithValue }) => {
    try {
      return await communityService.getCommunityById(communityId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Topluluk adına göre getir
export const fetchCommunityByName = createAsyncThunk(
  "communities/fetchCommunityByName",
  async (communityName, { rejectWithValue }) => {
    try {
      return await communityService.getCommunityByName(communityName);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Kullanıcının topluluklarını getir
export const fetchUserCommunities = createAsyncThunk(
  "communities/fetchUserCommunities",
  async (userId, { rejectWithValue }) => {
    try {
      return await communityService.getUserCommunities(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yeni topluluk oluştur
export const createCommunity = createAsyncThunk(
  "communities/createCommunity",
  async (communityData, { rejectWithValue }) => {
    try {
      return await communityService.createCommunity(communityData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Topluluğa katıl
export const joinCommunity = createAsyncThunk(
  "communities/joinCommunity",
  async (communityId, { rejectWithValue }) => {
    try {
      return await communityService.joinCommunity(communityId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Topluluktan ayrıl
export const leaveCommunity = createAsyncThunk(
  "communities/leaveCommunity",
  async (communityId, { rejectWithValue }) => {
    try {
      return await communityService.leaveCommunity(communityId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Başlangıç durumu
const initialState = {
  items: [],
  userCommunities: [],
  currentCommunity: null,
  loading: false,
  error: null,
};

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tüm toplulukları getir
      .addCase(fetchAllCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.communities || action.payload || [];
      })
      .addCase(fetchAllCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Topluluk detaylarını getir
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Topluluk adına göre getir
      .addCase(fetchCommunityByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityByName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Kullanıcının topluluklarını getir
      .addCase(fetchUserCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.userCommunities =
          action.payload.communities || action.payload || [];
      })
      .addCase(fetchUserCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Yeni topluluk oluştur
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        const newCommunity = action.payload.community || action.payload;
        state.items = [newCommunity, ...state.items];
        state.userCommunities = [newCommunity, ...state.userCommunities];
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Topluluğa katıl
      .addCase(joinCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity) {
          state.currentCommunity.is_member = true;
          state.currentCommunity.member_count += 1;
        }
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Topluluktan ayrıl
      .addCase(leaveCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        state.loading = false;
        const communityId = action.meta.arg;

        if (
          state.currentCommunity &&
          state.currentCommunity.id === communityId
        ) {
          state.currentCommunity.is_member = false;
          state.currentCommunity.member_count -= 1;
        }

        // Kullanıcının toplulukları listesinden çıkar
        state.userCommunities = state.userCommunities.filter(
          (community) => community.id !== communityId
        );
      })
      .addCase(leaveCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, clearError } = communitiesSlice.actions;
export default communitiesSlice.reducer;
