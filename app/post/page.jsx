"use client";

import React, { useState, useEffect } from "react";
import ShareComp from "../../components/PostComponents/PostButtons/ShareComp";
import posts from "../../mockData/posts";
import comments from "../../mockData/comments";

export default function PostDetail() {
  const [showShare, setShowShare] = useState(false);
  const [postData, setPostData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);

  useEffect(() => {
    const postId = window.location.search.split("id=")[1];
    const foundPost = posts.find((post) => post.id === parseInt(postId));
    setPostData(foundPost);

    if (foundPost) {
      const postComments = comments.filter((comment) => comment.postId === foundPost.id);
      setCommentsData(postComments);
    }
  }, []);

  console.log(postData, commentsData);

  return (
    <main className="min-h-screen p-4 pt-20 bg-background text-black">
      <article className="max-w-3xl mx-auto bg-foreground/5 rounded-lg p-6 shadow-lg">
        <header className="flex items-start gap-3 mb-4">
          <div className="flex flex-col items-center gap-0.5">
            <button
              className="p-0.5 hover:bg-foreground/10 rounded transition-colors"
              aria-label="Upvote"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-accent hover:text-accent/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <span className="font-medium text-base text-black">
              {postData?.upvotes}
            </span>
            <button
              className="p-0.5 hover:bg-foreground/10 rounded transition-colors"
              aria-label="Downvote"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 hover:text-accent/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-sm text-black mb-1.5">
              <span className="hover:underline cursor-pointer">
                Posted by u/{postData?.author?.username}
              </span>
              <span>•</span>
              <time className="text-black">{postData?.created_at}</time>
            </div>
            <h1 className="text-xl font-bold text-black mb-3">
              {postData?.title}
            </h1>
            <div className="prose text-black max-w-none">
              <p className="text-sm leading-relaxed">{postData?.content}</p>
              <img
                src={postData?.image}
                alt={postData?.title}
                className="w-full rounded-lg my-3 object-cover max-h-[400px]"
              />
            </div>

            <div className="flex items-center gap-3 mt-4 text-black">
              <button className="flex items-center gap-1.5 hover:bg-foreground/10 p-1.5 rounded transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium text-sm">
                  {postData?.comments} Comments
                </span>
              </button>

              <button
                className="flex items-center gap-1.5 hover:bg-foreground/10 p-1.5 rounded transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowShare(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="font-medium text-sm">Share</span>
              </button>

              <button className="flex items-center gap-1.5 hover:bg-foreground/10 p-1.5 rounded transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span className="font-medium text-sm">Save</span>
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 space-y-4">
          {commentsData.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="bg-foreground/10 p-3 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-accent/20"></div>
                  <div>
                    <span className="font-medium text-xs">u/{comment.author?.username}</span>
                    <span className="text-xs text-black/60 ml-1.5">
                      {comment.created_at}
                    </span>
                  </div>
                </div>
                <p className="text-xs">
                  {comment.content}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <button className="flex items-center gap-0.5 text-black/60 hover:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>{comment.upvotes}</span>
                  </button>
                  <button className="text-black/60 hover:text-black">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </article>
      {/* <ShareComp
        show={true}
        onClose={() => console.log("Share dialog closed")}
      /> */}
    </main>
  );
}
