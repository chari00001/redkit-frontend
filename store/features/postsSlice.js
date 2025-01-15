import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { posts } from "@/mockData/posts";

// Async thunk for fetching posts by community name
export const getCommunityPosts = createAsyncThunk(
  "posts/getCommunityPosts",
  async (communityName) => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const communityPosts = posts.filter(
        (post) =>
          post.community?.name.toLowerCase() === communityName.toLowerCase()
      );

      return communityPosts;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for fetching a single post by ID
export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId) => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const post = posts.find((p) => p.id === postId);
      if (!post) {
        throw new Error("Gönderi bulunamadı");
      }

      return post;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  posts: [],
  userPosts: [],
  communityPosts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCommunityPosts: (state, action) => {
      state.communityPosts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
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
      // getCommunityPosts cases
      .addCase(getCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunityPosts.fulfilled, (state, action) => {
        state.communityPosts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // getPostById cases
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.currentPost = null;
      });
  },
});

export const {
  setPosts,
  setUserPosts,
  setCommunityPosts,
  setCurrentPost,
  setLoading,
  setError,
} = postsSlice.actions;

export default postsSlice.reducer;
