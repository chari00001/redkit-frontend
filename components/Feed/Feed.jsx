"use client";

import React from "react";
import PostCard from "@/components/PostComponents/PostCard";
import posts from "@/mockData/posts";
import Link from "next/link";

const Feed = () => {
  return (
    <div className="">
      {posts.map((post) => (
        <Link href={`/post?id=${post.id}`} key={post.id}>
          <PostCard
            text={post.content}
            image={post.image}
            author={post.author}
            upvotes={post.upvotes}
            comments={post.comments}
          />
        </Link>
      ))}
    </div>
  );
};

export default Feed;
