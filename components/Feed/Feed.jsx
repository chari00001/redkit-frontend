"use client"

import React from 'react'
import PostCard from "@/components/PostComponents/PostCard"
import { useRouter } from 'next/navigation'

const mockPosts = [
  {
    id: 1,
    text: "Just learned something amazing about React hooks today! Can't wait to implement it in my next project. #coding #webdev",
    image: null,
    author: "reactEnthusiast",
    timePosted: "2 hours ago",
    commentCount: 15
  },
  {
    id: 2,
    text: null,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=500",
    author: "webDev123",
    timePosted: "4 hours ago",
    commentCount: 8
  },
  {
    id: 3, 
    text: "Working on a new project with Next.js and Tailwind CSS. The developer experience is incredible!",
    image: null,
    author: "webDev123",
    timePosted: "6 hours ago",
    commentCount: 2
  },
  {
    id: 4,
    text: "Beautiful sunset from my coding session today",
    image: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=500&h=500",
    author: "reactEnthusiast",
    timePosted: "8 hours ago",
    commentCount: 10
  },
  {
    id: 5,
    text: "Just deployed my first full-stack application! Feel free to check it out and give feedback.",
    image: null,
    author: "webDev123",
    timePosted: "10 hours ago",
    commentCount: 5
  }
]

const Feed = () => {
  const router = useRouter();

  const handlePostClick = (postId) => {
    // Using the correct Next.js route format
    router.push(`/post?id=${postId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {mockPosts.map(post => (
        <div key={post.id} onClick={() => handlePostClick(post.id)} className="cursor-pointer">
          <PostCard 
            text={post.text}
            image={post.image}
            author={post.author}
            timePosted={post.timePosted}
            commentCount={post.commentCount}
          />
        </div>
      ))}
    </div>
  )
}

export default Feed