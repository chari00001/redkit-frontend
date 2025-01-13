import { createSlice } from "@reduxjs/toolkit";
import { comments } from "@/mockData/comments";

const initialState = {
  comments: [],
  postComments: [],
  loading: false,
  error: null,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPostComments: (state, action) => {
      state.postComments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload);
      if (
        state.postComments.length > 0 &&
        action.payload.post_id === state.postComments[0].post_id
      ) {
        state.postComments.unshift(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
    updateComment: (state, action) => {
      const index = state.comments.findIndex(
        (comment) => comment.id === action.payload.id
      );
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
      const postCommentIndex = state.postComments.findIndex(
        (comment) => comment.id === action.payload.id
      );
      if (postCommentIndex !== -1) {
        state.postComments[postCommentIndex] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
      state.postComments = state.postComments.filter(
        (comment) => comment.id !== action.payload
      );
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
});

// Actions
export const {
  setComments,
  setPostComments,
  addComment,
  updateComment,
  deleteComment,
  setLoading,
  setError,
} = commentsSlice.actions;

// Thunks
export const getPostComments = (postId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // API çağrısı simülasyonu
    const postComments = comments
      .filter((comment) => comment.post_id === postId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    dispatch(setPostComments(postComments));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default commentsSlice.reducer;
