"use client";

import React from "react";
import PostCard from "@/components/PostComponents/PostCard";
import { posts } from "@/mockData/posts";
import { users } from "@/mockData/users";
import Link from "next/link";

const Feed = () => {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const author = users.find((user) => user.id === post.user_id);
        return (
          <Link href={`/post/${post.id}`} key={post.id}>
            <PostCard
              title={post.title}
              content={post.content}
              media_url={post.media_url}
              author={{
                username: author?.username,
                profile_picture_url: author?.profile_picture_url,
              }}
              likes_count={post.likes_count}
              comments_count={post.comments_count}
              created_at={post.created_at}
              tags={post.tags}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
