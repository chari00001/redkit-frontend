const posts = [
  {
    id: 1,
    title: "Best Programming Languages in 2023",
    content:
      "Here's my take on the most in-demand programming languages this year...",
    upvotes: 234,
    comments: 45,
    created_at: "2023-10-15",
    communityId: 3, // Eşleşen topluluk ID'si
    author: {
      username: "CodeMaster",
      profile_picture_url: "https://i.pravatar.cc/300",
    },
    image: "https://picsum.photos/800/400", // Rastgele manzara formatında gönderi resmi
  },
  {
    id: 2,
    title: "Tips for Clean Code",
    content:
      "Let's discuss some essential principles for writing maintainable code...",
    upvotes: 567,
    comments: 89,
    created_at: "2023-10-14",
    communityId: 3, // Eşleşen topluluk ID'si
    author: {
      username: "CleanCoder",
      profile_picture_url: "https://i.pravatar.cc/301",
    },
    image: "https://picsum.photos/800/401", // Rastgele manzara formatında gönderi resmi
  },
  {
    id: 3,
    title: "Oppenheimer vs Barbie - Which deserves Best Picture?",
    content: "A deep dive into the themes and cinematography of both films.",
    upvotes: 150,
    comments: 20,
    created_at: "2023-10-16",
    communityId: 1, // Eşleşen topluluk ID'si
    author: {
      username: "FilmBuff2024",
      profile_picture_url: "https://i.pravatar.cc/302",
    },
    image: "https://picsum.photos/800/402", // Rastgele manzara formatında gönderi resmi
  },
  {
    id: 4,
    title: "The Last of Us Season 2 begins filming!",
    content: "Exciting news for fans of the series!",
    upvotes: 300,
    comments: 50,
    created_at: "2023-10-17",
    communityId: 2, // Eşleşen topluluk ID'si
    author: {
      username: "TVEnthusiast",
      profile_picture_url: "https://i.pravatar.cc/303",
    },
    image: "https://picsum.photos/800/403", // Rastgele manzara formatında gönderi resmi
  },
];

export default posts;
