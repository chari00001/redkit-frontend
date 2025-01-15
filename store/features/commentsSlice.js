import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [], // [{id, postId, userId, content, created_at, likes_count, parent_id}]
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      const newComment = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        likes_count: 0,
        ...action.payload,
      };
      state.comments.push(newComment);
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },
    updateComment: (state, action) => {
      const { id, content } = action.payload;
      const comment = state.comments.find((c) => c.id === id);
      if (comment) {
        comment.content = content;
      }
    },
    likeComment: (state, action) => {
      const comment = state.comments.find((c) => c.id === action.payload);
      if (comment) {
        comment.likes_count += 1;
      }
    },
    unlikeComment: (state, action) => {
      const comment = state.comments.find((c) => c.id === action.payload);
      if (comment && comment.likes_count > 0) {
        comment.likes_count -= 1;
      }
    },
    getPostComments: (state, action) => {
      // Bu reducer sadece state'i değiştirmez, mevcut yorumları döndürür
      return state;
    },
  },
});

export const {
  addComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
  getPostComments,
} = commentsSlice.actions;

// Selector'lar
export const selectPostComments = (state, postId) =>
  state.comments.comments.filter((comment) => comment.postId === postId);

export default commentsSlice.reducer;
