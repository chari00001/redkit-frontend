"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FaReply, FaTrash, FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import {
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
} from "@/store/features/commentsSlice";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { postService } from "@/services/apiService";

const CommentItem = ({
  comment,
  postId,
  onReply,
  onEdit,
  loadingActions,
  setLoadingActions,
  level = 0,
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comments);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwnComment =
    currentUser?.id === comment.userId || currentUser?.id === comment.user_id;
  const isActionLoading = loadingActions[comment.id];
  const isLikeLoading = loadingActions[`like_${comment.id}`];

  const replies = comments.filter((reply) => reply.parent_id === comment.id);

  const handleUpdateComment = async () => {
    if (!editContent.trim()) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [comment.id]: true }));
      const commentData = { content: editContent.trim() };

      const response = await postService.updateComment(
        postId,
        comment.id,
        commentData
      );

      if (response.success) {
        dispatch(
          updateComment({
            id: comment.id,
            content: editContent.trim(),
          })
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Yorum güncelleme hatası:", error);
      alert("Yorum güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [comment.id]: false }));
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [comment.id]: true }));
      const response = await postService.deleteComment(postId, comment.id);

      if (response.success) {
        dispatch(deleteComment(comment.id));
      }
    } catch (error) {
      console.error("Yorum silme hatası:", error);
      alert("Yorum silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [comment.id]: false }));
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      setLoadingActions((prev) => ({ ...prev, [`like_${comment.id}`]: true }));
      const response = await postService.likeComment(postId, comment.id);

      if (response.success) {
        if (comment.user_liked) {
          dispatch(unlikeComment(comment.id));
        } else {
          dispatch(likeComment(comment.id));
        }
      }
    } catch (error) {
      console.error("Yorum beğeni hatası:", error);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [`like_${comment.id}`]: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${
        level > 0 ? "ml-8 mt-4" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={
            comment.user?.profile_picture_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
              comment.userId || comment.user_id
            }&backgroundColor=b6e3f4`
          }
          alt="Kullanıcı"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 truncate">
              u/{comment.user?.username || comment.userId || comment.user_id}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: tr,
              })}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none text-sm"
                rows={3}
                placeholder="Yorumunuzu düzenleyin..."
                disabled={isActionLoading}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                  disabled={isActionLoading}
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateComment}
                  className="px-3 py-1 text-xs text-white bg-accent hover:bg-accent-dark rounded-lg disabled:opacity-50"
                  disabled={isActionLoading || !editContent.trim()}
                >
                  {isActionLoading ? "Güncelleniyor..." : "Güncelle"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed break-words">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 rounded-full px-2 py-1 transition-colors text-xs ${
                comment.user_liked
                  ? "text-red-500 bg-red-50"
                  : "text-gray-500 hover:text-red-500 hover:bg-red-50"
              }`}
              disabled={isLikeLoading || !currentUser}
            >
              {comment.user_liked ? (
                <FaHeart size={12} />
              ) : (
                <FaRegHeart size={12} />
              )}
              <span className="font-medium">{comment.likes_count || 0}</span>
            </button>

            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-accent hover:bg-accent/10 rounded-full px-2 py-1 transition-colors"
              disabled={!currentUser}
            >
              <FaReply size={12} />
              <span>Yanıtla</span>
            </button>

            {isOwnComment && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-accent hover:bg-accent/10 rounded-full px-2 py-1 transition-colors"
                  disabled={isActionLoading}
                >
                  <FaEdit size={12} />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full px-2 py-1 transition-colors"
                  disabled={isActionLoading}
                >
                  <FaTrash size={12} />
                  <span>{isActionLoading ? "Siliniyor..." : "Sil"}</span>
                </button>
              </>
            )}
          </div>

          {/* Alt yorumları render et */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-2">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReply={onReply}
                  onEdit={onEdit}
                  loadingActions={loadingActions}
                  setLoadingActions={setLoadingActions}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;
