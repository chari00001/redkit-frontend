"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/PostComponents/PostCard";
import { postService, recommenderService } from "@/services/apiService";
import { useSelector } from "react-redux";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Eğer kullanıcı giriş yapmışsa recommender'dan kişiselleştirilmiş feed al
        if (currentUser?.id) {
          try {
            const recommendedResponse = await recommenderService.getFeed(
              currentUser.id
            );
            if (recommendedResponse) {
              console.log(
                "Recommender servisinden feed alındı:",
                recommendedResponse
              );
              if (
                recommendedResponse.feed &&
                Array.isArray(recommendedResponse.feed)
              ) {
                setPosts(recommendedResponse.feed);
              } else {
                setPosts([]);
              }
              return;
            }
          } catch (recommenderError) {
            console.warn(
              "Recommender servisinden feed alınamadı, genel feed'e geçiliyor:",
              recommenderError
            );
          }
        }

        // Fallback: Genel postları al
        const response = await postService.getAllPosts();
        if (response.success) {
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
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center p-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Henüz gönderi bulunmuyor.</p>
        {currentUser && (
          <p className="text-sm text-gray-400 mt-2">
            Kişiselleştirilmiş öneriler için daha fazla içerikle etkileşime
            geçin.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentUser && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
          🎯 Sizin için özelleştirilmiş içerikler
        </div>
      )}
      {posts.map((post) => {
        return (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            media_url={post.media_url}
            author={{
              username: post.author?.username,
              profile_picture_url: post.author?.profile_picture_url,
            }}
            likes_count={post.likes_count}
            comments_count={post.comments_count}
            views_count={post.views_count}
            created_at={post.created_at}
            tags={post.tags}
          />
        );
      })}
    </div>
  );
};

export default Feed;
