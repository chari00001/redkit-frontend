import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postService, communityService } from "@/services/apiService";

// Post listeleme
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params, { rejectWithValue }) => {
    try {
      return await postService.getAllPosts(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tekil post detayı getirme
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      return await postService.getPostById(postId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Topluluk postlarını getirme
export const getCommunityPosts = createAsyncThunk(
  "posts/getCommunityPosts",
  async (communityId, { rejectWithValue }) => {
    try {
      return await communityService.getCommunityPosts(communityId);
    } catch (error) {
      console.error(
        `Error fetching community posts for ${communityId}:`,
        error
      );
      return rejectWithValue(error.message);
    }
  }
);

// Yeni post oluşturma
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      return await postService.createPost(postData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Post güncelleme
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      return await postService.updatePost(postId, postData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Post silme
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      return await postService.deletePost(postId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentPost: null,
  communityPosts: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCommunityPosts: (state) => {
      state.communityPosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.posts || action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post by id
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.data || action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get community posts
      .addCase(getCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.communityPosts =
          action.payload.posts || action.payload.data?.posts || [];
      })
      .addCase(getCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.communityPosts = [];
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost = action.payload.data || action.payload;
        state.items = [newPost, ...state.items];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload.data || action.payload;

        // Update in items array
        const index = state.items.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (index !== -1) {
          state.items[index] = updatedPost;
        }

        // Update current post if it's the same
        if (state.currentPost && state.currentPost.id === updatedPost.id) {
          state.currentPost = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        const deletedPostId = action.meta.arg; // postId that was passed to the action
        state.items = state.items.filter((post) => post.id !== deletedPostId);
        if (state.currentPost && state.currentPost.id === deletedPostId) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, clearError, clearCommunityPosts } =
  postsSlice.actions;
export default postsSlice.reducer;
