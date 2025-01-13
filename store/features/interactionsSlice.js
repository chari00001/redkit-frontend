import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likes: [],
  follows: [],
  messages: [],
  notifications: [],
  unreadMessages: 0,
  unreadNotifications: 0,
  loading: false,
  error: null,
};

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    // Likes
    setLikes: (state, action) => {
      state.likes = action.payload;
      state.loading = false;
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
    removeLike: (state, action) => {
      const { userId, postId } = action.payload;
      state.likes = state.likes.filter(
        (like) => !(like.user_id === userId && like.post_id === postId)
      );
    },

    // Follows
    setFollows: (state, action) => {
      state.follows = action.payload;
      state.loading = false;
    },
    addFollow: (state, action) => {
      state.follows.push(action.payload);
    },
    removeFollow: (state, action) => {
      const { followerId, followeeId } = action.payload;
      state.follows = state.follows.filter(
        (follow) =>
          !(
            follow.follower_id === followerId &&
            follow.followee_id === followeeId
          )
      );
    },

    // Messages
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
      if (action.payload.receiver_id === state.messages[0]?.receiver_id) {
        state.unreadMessages++;
      }
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (msg) => msg.id === action.payload.id
      );
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
    markMessageAsRead: (state, action) => {
      const message = state.messages.find((msg) => msg.id === action.payload);
      if (message) {
        message.status = "read";
        state.unreadMessages = Math.max(0, state.unreadMessages - 1);
      }
    },

    // Notifications
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadNotifications++;
      }
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.is_read = true;
      });
      state.unreadNotifications = 0;
    },
    deleteNotification: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.is_read) {
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },

    // Common
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  // Likes
  setLikes,
  addLike,
  removeLike,
  // Follows
  setFollows,
  addFollow,
  removeFollow,
  // Messages
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  markMessageAsRead,
  // Notifications
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  // Common
  setLoading,
  setError,
} = interactionsSlice.actions;

export default interactionsSlice.reducer;
