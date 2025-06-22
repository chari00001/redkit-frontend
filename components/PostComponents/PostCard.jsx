"use client";

import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ShareComp from "./PostButtons/ShareComp";
import VoteComp from "./PostButtons/VoteComp";
import CommentComp from "./PostButtons/CommentComp";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import CommentSection from "./Comments/CommentSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postService } from "@/services/apiService";
import { interactionService, recommenderService } from "@/services/apiService";
import { useSelector } from "react-redux";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";

// Backend base URL'ini environment'tan al
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_POST_API_URL || "http://localhost:3002";

const PostCard = ({
  id,
  title,
  content,
  media_url,
  author,
  likes_count = 0,
  comments_count = 0,
  views_count = 0,
  created_at,
  tags,
  community,
}) => {
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.auth);
  const [votes, setVotes] = useState(likes_count ? parseInt(likes_count) : 0);
  const [voted, setVoted] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // İlk yüklemede localStorage'dan beğeni durumunu yükle
  useEffect(() => {
    if (typeof window === "undefined" || !currentUser) return;

    try {
      const voteKey = `post_vote_${id}_user_${currentUser.id}`;
      const storedVote = localStorage.getItem(voteKey); // 'up' | 'down'
      if (storedVote === "up" || storedVote === "down") {
        setVoted(storedVote);
      }
    } catch (error) {
      console.error("Beğeni durumu localStorage'dan okunamadı:", error);
    }
  }, [id, currentUser]);

  const postImageUrl = React.useMemo(() => {
    if (!media_url) return null;

    try {
      // URL'i decode et ve temizle
      let cleanUrl = media_url;

      // Eğer URL encode edilmişse decode et
      if (cleanUrl.includes("%")) {
        try {
          cleanUrl = decodeURIComponent(cleanUrl);
        } catch (decodeError) {
          console.warn("URL decode edilemedi:", decodeError);
        }
      }

      // Eğer URL absolute ise doğrudan döndür
      if (cleanUrl.startsWith("http")) {
        return cleanUrl;
      }

      // Relative URL ise backend base URL'i ile birleştir
      if (cleanUrl.startsWith("/uploads/")) {
        const finalUrl = `${BACKEND_BASE_URL}${cleanUrl}`;
        return finalUrl;
      }

      // Son çare olarak picsum kullan
      const fallbackUrl = `https://picsum.photos/800/600?random=${encodeURIComponent(
        title || ""
      )}`;
      return fallbackUrl;
    } catch (error) {
      console.error("PostImageUrl oluşturma hatası:", error);
      return `https://picsum.photos/800/600?random=${encodeURIComponent(
        title || ""
      )}`;
    }
  }, [media_url, title]);

  const avatarUrl = React.useMemo(() => {
    const profilePic = author?.profile_picture_url;
    if (!profilePic) return DEFAULT_AVATAR;

    try {
      // URL'i decode et ve temizle
      let cleanUrl = profilePic;

      // Eğer URL encode edilmişse decode et
      if (cleanUrl.includes("%")) {
        try {
          cleanUrl = decodeURIComponent(cleanUrl);
        } catch (decodeError) {
          console.warn("Avatar URL decode edilemedi:", decodeError);
        }
      }

      if (cleanUrl.startsWith("http")) {
        return cleanUrl;
      }

      return DEFAULT_AVATAR;
    } catch (error) {
      console.error("AvatarUrl oluşturma hatası:", error);
      return DEFAULT_AVATAR;
    }
  }, [author?.profile_picture_url]);

  const handleVote = async (direction) => {
    if (!currentUser || isLiking) return;

    let delta = 0;
    try {
      setIsLiking(true);

      // --- Yeni oy algoritması ---
      let newVote = voted;

      if (voted === direction) {
        // Aynı oyu tekrar tıklandı -> oyu kaldır
        newVote = null;
        delta = direction === "up" ? -1 : +1;
      } else if (voted === null) {
        // İlk kez oy veriliyor
        newVote = direction;
        delta = direction === "up" ? +1 : -1;
      } else {
        // Karşıt oya geçiş
        newVote = direction;
        delta = direction === "up" ? +2 : -2;
      }

      // Optimistic state güncellemesi
      setVoted(newVote);
      setVotes((prev) => Math.max(prev + delta, 0));

      // API çağrısı
      const response = await postService.votePost(
        id,
        newVote ? newVote : "clear"
      );

      // Etkileşim servisine "like" kaydet (sadece upvote için)
      if (newVote === "up" && currentUser && tags) {
        try {
          // Tags'i parse et - string formatından array'e çevir
          const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

          if (Array.isArray(parsedTags) && parsedTags.length > 0) {
            parsedTags.forEach((t) =>
              interactionService
                .likeTag(currentUser.id, t)
                .catch((err) => console.error("Like interaction error", err))
            );
          }
        } catch (parseError) {
          console.error("Tags parse edilirken hata oluştu:", parseError);
        }
      }

      // Recommender API'ye de kaydet
      recommenderService
        .trackInteraction(currentUser.id, id, "like")
        .catch((err) => console.error("Recommender like tracking error", err));

      // API yanıtına göre kesin son durumu ayarla
      if (response && response.success) {
        // Sunucudan dönen kesin score varsa kullanabiliriz (varsayım: response.data.likes_count)
        if (response.data && typeof response.data.likes_count === "number") {
          setVotes(response.data.likes_count);
        }

        // localStorage güncelle
        try {
          const voteKey = `post_vote_${id}_user_${currentUser.id}`;
          if (newVote) {
            localStorage.setItem(voteKey, newVote);
          } else {
            localStorage.removeItem(voteKey);
          }
        } catch (lsError) {
          console.error("Oy durumu localStorage'a yazılamadı:", lsError);
        }
      } else {
        throw new Error(response?.message || "Beğeni işlemi başarısız");
      }
    } catch (error) {
      console.error("Beğeni hatası:", error);
      // Sunucu hatası => optimistic güncellemeyi geri al
      setVoted(voted);
      setVotes((prev) => prev - delta); // delta variable available? we'll define outside? but error
    } finally {
      setIsLiking(false);
    }
  };

  const formatVoteCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const timeAgo = React.useMemo(() => {
    try {
      // Eğer created_at undefined, null, geçersiz tarih ise güvenli bir varsayılan değer döndür
      if (!created_at || isNaN(new Date(created_at).getTime())) {
        return "bilinmeyen zaman";
      }

      return formatDistanceToNow(new Date(created_at), {
        addSuffix: true,
        locale: tr,
      });
    } catch (error) {
      console.error("Tarih biçimlendirme hatası:", error);
      return "bilinmeyen zaman";
    }
  }, [created_at]);

  const handleImageError = (e) => {
    const failedUrl = e.target.src;
    console.error("Resim yüklenemedi:", failedUrl);

    // Eğer bu backend'den gelen bir resimse ve hala yüklenemiyorsa fallback dene
    if (failedUrl.includes("/uploads/") && !failedUrl.includes("picsum")) {
      e.target.src = `https://picsum.photos/800/600?random=${encodeURIComponent(
        title || Math.random().toString()
      )}`;
    } else {
      // Son çare olarak imageError state'ini true yap
      setImageError(true);
    }
  };

  const handleAvatarError = (e) => {
    console.error("Avatar yüklenemedi:", e.target.src);
    e.target.src = DEFAULT_AVATAR;
  };

  const handleNavigateToDetail = (e) => {
    e.stopPropagation();
    router.push(`/post/${id}`);
  };

  const handleAuthorClick = (e, username) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/user/${username}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100"
            onClick={(e) => handleAuthorClick(e, author?.username || "anonim")}
          >
            <img
              src={avatarUrl}
              alt={author?.username || "Kullanıcı"}
              className="w-full h-full object-cover"
              onError={handleAvatarError}
            />
          </motion.div>
          <div className="flex items-center">
            <span
              onClick={(e) =>
                handleAuthorClick(e, author?.username || "anonim")
              }
              className="font-medium text-gray-800 hover:text-accent cursor-pointer"
            >
              u/{author?.username || "anonim"}
            </span>
            <span className="text-sm text-gray-500 ml-2">• {timeAgo}</span>
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="content-area">
          {/* Başlık - Tıklanabilir */}
          <motion.h2
            onClick={handleNavigateToDetail}
            className="text-xl font-bold mb-2 text-gray-900 hover:text-accent cursor-pointer"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
          >
            {title}
          </motion.h2>

          {/* İçerik - Tıklanamaz */}
          <p className="text-gray-700 mb-4 line-clamp-3">{content}</p>

          {/* Medya - Tıklanabilir */}
          {postImageUrl && !imageError && (
            <motion.div
              onClick={handleNavigateToDetail}
              className="relative rounded-lg overflow-hidden mb-4 bg-gray-100 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <img
                  src={postImageUrl}
                  alt={title || "Post görseli"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Etiketler */}
        {tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(() => {
              try {
                // Tags'i parse et - string formatından array'e çevir
                const parsedTags =
                  typeof tags === "string" ? JSON.parse(tags) : tags;

                if (Array.isArray(parsedTags) && parsedTags.length > 0) {
                  return parsedTags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </motion.span>
                  ));
                }
                return null;
              } catch (parseError) {
                console.error("Tags parse edilirken hata oluştu:", parseError);
                return null;
              }
            })()}
          </div>
        )}

        {/* Aksiyon Çubuğu */}
        <div className="action-buttons flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          {/* Oylama Butonları */}
          <VoteComp
            likesCount={votes}
            userVote={voted}
            onVote={handleVote}
            disabled={isLiking || !currentUser}
            variant="updown"
          />

          {/* Diğer Aksiyonlar */}
          <div className="flex items-center gap-2">
            <CommentComp
              commentsCount={comments_count}
              isActive={showComments}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                setShowComments(!showComments);
              }}
            />

            {/* Görüntüleme Sayısı */}
            <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5">
              <FaEye size={16} />
              <span className="text-sm font-medium">
                {formatVoteCount(views_count || 0)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(true);
              }}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1.5"
            >
              <FaShare size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? "text-yellow-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {isBookmarked ? (
                <FaBookmark size={16} />
              ) : (
                <FaRegBookmark size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Yorum Bölümü */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 mt-4 comment-section"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <CommentSection postId={id} tags={tags} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paylaşım Modalı */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="share-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareComp
              show={showShare}
              onClose={() => setShowShare(false)}
              userId={currentUser?.id}
              tags={tags}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
