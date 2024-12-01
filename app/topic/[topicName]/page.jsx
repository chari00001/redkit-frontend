"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostComponents/PostCard';
import { FaUsers, FaInfoCircle } from 'react-icons/fa';

const mockTopics = {
  gaming: {
    name: "Gaming",
    description: "A community for gamers and gaming enthusiasts",
    memberCount: "34.2M",
    onlineCount: "42.3K",
    createdAt: "2008-01-25",
    rules: [
      "Keep it civil and on topic",
      "No hate speech or bullying",
      "No promotional content", 
      "Mark spoilers and NSFW"
    ],
    posts: [
      {
        id: 1,
        text: "Just finished Elden Ring after 100 hours! What an incredible journey!",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        author: "EldenLord",
        timePosted: "2 hours ago",
        commentCount: 156
      },
      {
        id: 2,
        text: "Starfield's latest patch notes are here! Major improvements incoming",
        image: null,
        author: "BethesdaFan",
        timePosted: "5 hours ago",
        commentCount: 234
      }
    ]
  },
  music: {
    name: "Music", 
    description: "The musical corner of the internet",
    memberCount: "30.1M",
    onlineCount: "28.4K",
    createdAt: "2008-01-24",
    rules: [
      "Be respectful of others' opinions",
      "No piracy",
      "Tag your spoilers",
      "No self-promotion"
    ],
    posts: [
      {
        id: 1,
        text: "Taylor Swift announces new surprise album!",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        author: "SwiftieForever",
        timePosted: "1 hour ago",
        commentCount: 892
      },
      {
        id: 2,
        text: "What's your most played song of 2024 so far?",
        image: null,
        author: "MusicLover",
        timePosted: "3 hours ago",
        commentCount: 445
      }
    ]
  },
  movies: {
    name: "Movies",
    description: "Discuss your favorite films and latest releases",
    memberCount: "28.9M",
    onlineCount: "32.1K", 
    createdAt: "2008-01-23",
    rules: [
      "No spoilers in titles",
      "Use appropriate flairs",
      "Be civil and respectful",
      "No piracy links"
    ],
    posts: [
      {
        id: 1,
        text: "Oppenheimer vs Barbie - Which deserves Best Picture?",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        author: "FilmBuff2024",
        timePosted: "4 hours ago",
        commentCount: 567
      },
      {
        id: 2,
        text: "Just watched The Batman (2022) for the first time - My thoughts",
        image: null,
        author: "DCFanatic",
        timePosted: "6 hours ago",
        commentCount: 234
      }
    ]
  },
  tv: {
    name: "Television",
    description: "Your hub for TV show discussions and news",
    memberCount: "25.6M",
    onlineCount: "29.8K",
    createdAt: "2008-01-22",
    rules: [
      "Mark all spoilers",
      "Stay on topic",
      "No illegal streaming links",
      "Be respectful to others"
    ],
    posts: [
      {
        id: 1,
        text: "The Last of Us Season 2 begins filming!",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37",
        author: "TVEnthusiast",
        timePosted: "3 hours ago",
        commentCount: 445
      },
      {
        id: 2,
        text: "Best TV shows of 2023 - Let's make a list",
        image: null,
        author: "SeriesJunkie",
        timePosted: "7 hours ago",
        commentCount: 322
      }
    ]
  },
  books: {
    name: "Books",
    description: "A community for book lovers and literature enthusiasts",
    memberCount: "22.3M",
    onlineCount: "18.5K",
    createdAt: "2008-01-21",
    rules: [
      "Use spoiler tags",
      "Be respectful of others' tastes",
      "No pirated content",
      "Properly format recommendations"
    ],
    posts: [
      {
        id: 1,
        text: "Brandon Sanderson announces new Mistborn trilogy!",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        author: "Bookworm99",
        timePosted: "5 hours ago",
        commentCount: 678
      },
      {
        id: 2,
        text: "What book changed your perspective on life?",
        image: null,
        author: "LitLover",
        timePosted: "8 hours ago",
        commentCount: 445
      }
    ]
  }
};

const TopicPage = () => {
  const params = useParams();
  const topicName = params.topicName;
  const topic = mockTopics[topicName];

  if (!topic) {
    return <div className="text-center mt-20">Topic not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Topic Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">r/{topic.name}</h1>
          <p className="text-gray-600 mb-4">{topic.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>{topic.memberCount} members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{topic.onlineCount} online</span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              <span>Created {new Date(topic.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Posts Feed */}
        <div className="flex-1 space-y-4">
          {topic.posts.map(post => (
            <PostCard
              key={post.id}
              text={post.text}
              image={post.image}
              author={post.author}
              timePosted={post.timePosted}
              commentCount={post.commentCount}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold mb-4 text-black">t/{topic.name} Rules</h2>
            <ol className="space-y-3">
              {topic.rules.map((rule, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {index + 1}. {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage; 