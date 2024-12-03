// mockData/comments.js
const comments = [
  {
    id: 1,
    postId: 1, // Eşleşen gönderi ID'si
    author: {
      username: "DevGuru",
      profile_picture_url: "https://i.pravatar.cc/303",
    },
    content: "I think Python is the best choice for beginners!",
    created_at: "2023-10-16",
  },
  {
    id: 2,
    postId: 1,
    author: {
      username: "CodeNinja",
      profile_picture_url: "https://i.pravatar.cc/304",
    },
    content: "JavaScript is also very popular and versatile.",
    created_at: "2023-10-17",
  },
  {
    id: 3,
    postId: 2,
    author: {
      username: "CleanCoder",
      profile_picture_url: "https://i.pravatar.cc/301",
    },
    content: "Always remember to comment your code!",
    created_at: "2023-10-18",
  },
  {
    id: 4,
    postId: 3,
    author: {
      username: "FilmFanatic",
      profile_picture_url: "https://i.pravatar.cc/302",
    },
    content: "Both films are amazing in their own right!",
    created_at: "2023-10-19",
  },
  {
    id: 5,
    postId: 4,
    author: {
      username: "TVFan",
      profile_picture_url: "https://i.pravatar.cc/305",
    },
    content: "Can't wait for the new season!",
    created_at: "2023-10-20",
  },
];

export default comments;
