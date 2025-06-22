import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [], // [{id, postId, userId, content, created_at, likes_count, parent_id, user_liked}]
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPostComments: (state, action) => {
      const { postId, comments } = action.payload;
      // Mevcut post yorumlarını kaldır ve yenilerini ekle
      state.comments = state.comments.filter(
        (comment) => comment.postId !== postId
      );
      state.comments.push(...comments);
    },
    addComment: (state, action) => {
      const newComment = {
        id: action.payload.id || Date.now(),
        created_at: action.payload.created_at || new Date().toISOString(),
        likes_count: action.payload.likes_count || 0,
        user_liked: false,
        ...action.payload,
      };
      state.comments.push(newComment);
    },
    deleteComment: (state, action) => {
      const commentId = action.payload;
      // Yorumu ve alt yorumlarını sil
      state.comments = state.comments.filter(
        (comment) => comment.id !== commentId && comment.parent_id !== commentId
      );
    },
    updateComment: (state, action) => {
      const { id, content } = action.payload;
      const comment = state.comments.find((c) => c.id === id);
      if (comment) {
        comment.content = content;
        comment.updated_at = new Date().toISOString();
      }
    },
    likeComment: (state, action) => {
      const comment = state.comments.find((c) => c.id === action.payload);
      if (comment) {
        if (!comment.user_liked) {
          comment.likes_count = (comment.likes_count || 0) + 1;
          comment.user_liked = true;
        }
      }
    },
    unlikeComment: (state, action) => {
      const comment = state.comments.find((c) => c.id === action.payload);
      if (comment && comment.user_liked) {
        comment.likes_count = Math.max((comment.likes_count || 0) - 1, 0);
        comment.user_liked = false;
      }
    },
    clearComments: (state) => {
      state.comments = [];
    },
    clearPostComments: (state, action) => {
      const postId = action.payload;
      state.comments = state.comments.filter(
        (comment) => comment.postId !== postId
      );
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setPostComments,
  addComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
  clearComments,
  clearPostComments,
} = commentsSlice.actions;

// Selector'lar
export const selectPostComments = (state, postId) =>
  state.comments.comments.filter((comment) => comment.postId === postId);

export const selectCommentsByParentId = (state, postId, parentId) =>
  state.comments.comments.filter(
    (comment) => comment.postId === postId && comment.parent_id === parentId
  );

export const selectTopLevelComments = (state, postId) =>
  state.comments.comments
    .filter((comment) => comment.postId === postId && !comment.parent_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

export const selectCommentsLoading = (state) => state.comments.loading;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
