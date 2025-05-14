"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/PostComponents/PostCard";
import { postService } from "@/services/apiService";
import Link from "next/link";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getAllPosts();
        if (response.success) {
          console.log("Gönderiler:", response.data);
          setPosts(response.data.posts);
        } else {
          setError("Gönderiler yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        setError("Gönderiler yüklenirken bir hata oluştu.");
        console.error("Gönderi getirme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="p-4">Henüz gönderi bulunmuyor.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        return (
          <Link href={`/post/${post.id}`} key={post.id}>
            <PostCard
              title={post.title}
              content={post.content}
              media_url={post.media_url}
              author={{
                username: post.author?.username,
                profile_picture_url: post.author?.profile_picture_url,
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
