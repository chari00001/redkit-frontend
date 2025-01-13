import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { communities } from "@/mockData/communities";

// Async thunk for fetching a community by name
export const getCommunityById = createAsyncThunk(
  "communities/getCommunityById",
  async (communityName) => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const community = communities.find(
        (c) => c.name.toLowerCase() === communityName.toLowerCase()
      );

      if (!community) {
        throw new Error("Topluluk bulunamadı");
      }

      return community;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  communities: [],
  userCommunities: [],
  currentCommunity: null,
  popularCommunities: [],
  loading: false,
  error: null,
};

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setCommunities: (state, action) => {
      state.communities = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserCommunities: (state, action) => {
      state.userCommunities = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentCommunity: (state, action) => {
      state.currentCommunity = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPopularCommunities: (state, action) => {
      state.popularCommunities = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunityById.fulfilled, (state, action) => {
        state.currentCommunity = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCommunities,
  setUserCommunities,
  setCurrentCommunity,
  setPopularCommunities,
  setLoading,
  setError,
} = communitiesSlice.actions;

export default communitiesSlice.reducer;
