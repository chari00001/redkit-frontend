"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReply,
  FaTrash,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  addComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
  setPostComments,
} from "@/store/features/commentsSlice";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { postService, interactionService } from "@/services/apiService";
import { rehydrateAuth } from "@/store/features/authSlice";
import { recommenderService } from "@/services/apiService";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId, tags = [] }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState({});

  const postComments = comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Auth state'ini yeniden yükle (eğer currentUser yoksa)
  useEffect(() => {
    if (!currentUser) {
      dispatch(rehydrateAuth());
    }
  }, [currentUser, dispatch]);

  // Yorumları yükle
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const response = await postService.getPostComments(postId);

        if (response.success && response.data) {
          // API response formatı: { success: true, data: { comments: [...], pagination: {...} } }
          const commentsArray = response.data.comments || response.data || [];

          // API'den gelen yorumları Redux'a kaydet
          const commentsWithPostId = commentsArray.map((comment) => ({
            ...comment,
            postId: postId,
            // Eğer user bilgisi yoksa, user_id ile temel user objesi oluştur
            user: comment.user || {
              id: comment.user_id,
              username: `User${comment.user_id}`, // Fallback username
              email: null,
              profile_picture_url: null,
            },
          }));

          dispatch(setPostComments({ postId, comments: commentsWithPostId }));
        }
      } catch (error) {
        console.error("Yorumlar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId, dispatch]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    // Auth debugging ve fallback
    let effectiveUser = currentUser;

    // Eğer Redux'ta currentUser yoksa localStorage'dan al
    if (!effectiveUser && typeof window !== "undefined") {
      try {
        const authState = JSON.parse(localStorage.getItem("authState"));
        if (authState && authState.isAuthenticated && authState.user) {
          effectiveUser = authState.user || authState.currentUser;
        }
      } catch (error) {
        console.error("Failed to parse localStorage authState:", error);
      }
    }

    if (!newComment.trim()) {
      alert("Lütfen bir yorum yazın.");
      return;
    }

    if (!effectiveUser) {
      alert("Yorum yapmak için giriş yapmanız gerekiyor.");
      return;
    }

    if (!postId) {
      alert("Post ID bulunamadı.");
      return;
    }

    try {
      setLoading(true);

      // API dokümantasyonuna uygun format - minimal test
      const commentData = {
        content: newComment.trim(),
      };

      const response = await postService.createComment(postId, commentData);

      if (response && response.success) {
        // Redux'a ekle
        const newCommentForRedux = {
          ...(response.data || {}),
          postId,
          userId: effectiveUser.id,
          user_id: effectiveUser.id, // API'den gelen format
          user: effectiveUser, // Kullanıcı bilgisini ekle
          id: response.data?.id || Date.now(), // Fallback ID
          created_at: response.data?.created_at || new Date().toISOString(),
          likes_count: response.data?.likes_count || 0,
          user_liked: false,
          anonymous: response.data?.anonymous || false,
          parent_id: response.data?.parent_id || null,
        };

        dispatch(addComment(newCommentForRedux));

        // Etkileşim servisine "comment" kaydet
        if (effectiveUser && tags) {
          try {
            // Tags'i parse et - string formatından array'e çevir
            const parsedTags =
              typeof tags === "string" ? JSON.parse(tags) : tags;

            if (Array.isArray(parsedTags) && parsedTags.length > 0) {
              parsedTags.forEach((t) =>
                interactionService
                  .commentTag(effectiveUser.id, t)
                  .catch((err) =>
                    console.error("Comment interaction error", err)
                  )
              );
            }
          } catch (parseError) {
            console.error("Tags parse edilirken hata oluştu:", parseError);
          }
        }

        // Recommender API'ye de kaydet
        if (effectiveUser) {
          recommenderService
            .trackInteraction(effectiveUser.id, postId, "comment")
            .catch((err) =>
              console.error("Recommender comment tracking error", err)
            );
        }
        setNewComment("");
      } else {
        throw new Error(response?.message || "Bilinmeyen hata");
      }
    } catch (error) {
      console.error("Yorum oluşturma hatası:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
      alert(`Yorum gönderilemedi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    // Auth debugging ve fallback (ana comment gibi)
    let effectiveUser = currentUser;

    // Eğer Redux'ta currentUser yoksa localStorage'dan al
    if (!effectiveUser && typeof window !== "undefined") {
      try {
        const authState = JSON.parse(localStorage.getItem("authState"));
        if (authState && authState.isAuthenticated && authState.user) {
          effectiveUser = authState.user || authState.currentUser;
        }
      } catch (error) {
        console.error(
          "Failed to parse localStorage authState for reply:",
          error
        );
      }
    }

    if (!replyContent.trim() || !effectiveUser) {
      return;
    }

    try {
      setLoadingActions((prev) => ({ ...prev, [parentId]: true }));

      const commentData = {
        content: replyContent.trim(),
        parent_id: parentId, // Reply için parent_id gerekli
        anonymous: false,
      };

      const response = await postService.createComment(postId, commentData);

      if (response && response.success) {
        // Redux'a ekle
        const newReplyForRedux = {
          ...(response.data || {}),
          postId,
          userId: effectiveUser.id,
          user_id: effectiveUser.id, // API format
          user: effectiveUser,
          id: response.data?.id || Date.now(),
          created_at: response.data?.created_at || new Date().toISOString(),
          likes_count: response.data?.likes_count || 0,
          user_liked: false,
          parent_id: parentId, // ÇOK ÖNEMLİ: parent_id'yi koruyalım
          anonymous: response.data?.anonymous || false,
        };

        dispatch(addComment(newReplyForRedux));
        setReplyingTo(null);
        setReplyContent("");
      } else {
        throw new Error(response?.message || "Bilinmeyen hata");
      }
    } catch (error) {
      console.error("Yanıt oluşturma hatası:", error);
      alert(`Yanıt gönderilemedi: ${error.message}`);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [commentId]: true }));
      const commentData = { content: editContent.trim() };

      const response = await postService.updateComment(
        postId,
        commentId,
        commentData
      );

      if (response.success) {
        dispatch(
          updateComment({
            id: commentId,
            content: editContent.trim(),
          })
        );
        setEditingComment(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Yorum güncelleme hatası:", error);
      alert("Yorum güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [commentId]: true }));
      const response = await postService.deleteComment(postId, commentId);

      if (response.success) {
        dispatch(deleteComment(commentId));
      }
    } catch (error) {
      console.error("Yorum silme hatası:", error);
      alert("Yorum silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleLike = async (commentId, isLiked) => {
    if (!currentUser) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [`like_${commentId}`]: true }));
      const response = await postService.likeComment(postId, commentId);

      if (response.success) {
        // Redux'da beğeni durumunu güncelle
        if (isLiked) {
          dispatch(unlikeComment(commentId));
        } else {
          dispatch(likeComment(commentId));
        }
      }
    } catch (error) {
      console.error("Yorum beğeni hatası:", error);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`like_${commentId}`]: false }));
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment.id);
    setReplyContent(`@${comment.user?.username || comment.userId} `);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  if (loading && postComments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <p className="text-gray-500">Yorumlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
            rows={3}
            placeholder="Bir yorum yazın..."
            disabled={loading}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="px-4 py-2 text-white bg-accent hover:bg-accent-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor..." : "Yorum Yap"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Yorum yapmak için{" "}
            <button
              onClick={() => {
                /* Auth modal'ı aç */
              }}
              className="text-accent hover:underline"
            >
              giriş yapın
            </button>
          </p>
        </div>
      )}

      {/* Yanıt formu */}
      {replyingTo && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitReply(replyingTo);
          }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">
              Yanıt yazıyorsunuz
            </span>
            <button
              type="button"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
            rows={3}
            placeholder="Yanıtınızı yazın..."
            disabled={loadingActions[replyingTo]}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={loadingActions[replyingTo]}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-accent hover:bg-accent-dark rounded-lg disabled:opacity-50"
              disabled={loadingActions[replyingTo] || !replyContent.trim()}
            >
              {loadingActions[replyingTo] ? "Gönderiliyor..." : "Yanıtla"}
            </button>
          </div>
        </motion.form>
      )}

      <AnimatePresence>
        {postComments.map((comment) => {
          if (!comment.parent_id) {
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReply={handleReply}
                onEdit={handleEdit}
                loadingActions={loadingActions}
                setLoadingActions={setLoadingActions}
                level={0}
              />
            );
          }
          return null;
        })}
      </AnimatePresence>

      {postComments.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Debug: {postComments.length} yorum Redux'ta mevcut
      </div>
    </div>
  );
};

export default CommentSection;
