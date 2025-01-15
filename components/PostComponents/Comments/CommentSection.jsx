"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaReply,
  FaTrash,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import {
  addComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
} from "@/store/features/commentsSlice";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const postComments = comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    dispatch(
      addComment({
        postId,
        userId: currentUser.id,
        content: newComment.trim(),
        parent_id: null,
      })
    );
    setNewComment("");
  };

  const handleSubmitReply = (parentId) => {
    if (!replyContent.trim() || !currentUser) return;

    dispatch(
      addComment({
        postId,
        userId: currentUser.id,
        content: replyContent.trim(),
        parent_id: parentId,
      })
    );
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleUpdateComment = (commentId) => {
    if (!editContent.trim()) return;

    dispatch(
      updateComment({
        id: commentId,
        content: editContent.trim(),
      })
    );
    setEditingComment(null);
    setEditContent("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      dispatch(deleteComment(commentId));
    }
  };

  const handleLike = (commentId, isLiked) => {
    if (isLiked) {
      dispatch(unlikeComment(commentId));
    } else {
      dispatch(likeComment(commentId));
    }
  };

  const renderComment = (comment) => {
    const isEditing = editingComment === comment.id;
    const isReplying = replyingTo === comment.id;
    const isOwnComment = currentUser?.id === comment.userId;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg p-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4"
            alt="Kullanıcı"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {comment.userId}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: tr,
                })}
              </span>
            </div>

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateComment(comment.id);
                }}
                className="mt-2"
              >
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                  rows={3}
                  placeholder="Yorumunuzu düzenleyin..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white bg-accent hover:bg-accent-dark rounded-lg"
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 mt-1">{comment.content}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleLike(comment.id, false)}
                  className="p-1 text-gray-500 hover:text-accent rounded-full"
                >
                  <FaArrowUp size={14} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {comment.likes_count}
                </span>
                <button
                  onClick={() => handleLike(comment.id, true)}
                  className="p-1 text-gray-500 hover:text-red-500 rounded-full"
                >
                  <FaArrowDown size={14} />
                </button>
              </div>

              <button
                onClick={() => {
                  setReplyingTo(comment.id);
                  setReplyContent(`@${comment.userId} `);
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-accent"
              >
                <FaReply size={14} />
                <span>Yanıtla</span>
              </button>

              {isOwnComment && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-accent"
                  >
                    <FaEdit size={14} />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                  >
                    <FaTrash size={14} />
                    <span>Sil</span>
                  </button>
                </>
              )}
            </div>

            {isReplying && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitReply(comment.id);
                }}
                className="mt-4"
              >
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                  rows={3}
                  placeholder="Yanıtınızı yazın..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white bg-accent hover:bg-accent-dark rounded-lg"
                  >
                    Yanıtla
                  </button>
                </div>
              </form>
            )}

            {/* Alt yorumları göster */}
            {comments
              .filter((reply) => reply.parent_id === comment.id)
              .map((reply) => (
                <div key={reply.id} className="ml-8 mt-4">
                  {renderComment(reply)}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    );
  };

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
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 text-white bg-accent hover:bg-accent-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yorum Yap
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

      <AnimatePresence>
        {postComments.map((comment) => {
          if (!comment.parent_id) {
            return renderComment(comment);
          }
          return null;
        })}
      </AnimatePresence>

      {postComments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz yorum yapılmamış</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
