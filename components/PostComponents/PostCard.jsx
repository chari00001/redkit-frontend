"use client"

import React, { useState } from 'react'
import { FaArrowUp, FaArrowDown, FaComment, FaShare } from 'react-icons/fa'
import { motion } from 'framer-motion'

const PostCard = () => {
  const [votes, setVotes] = useState(1423)
  const [voted, setVoted] = useState(null) // null, 'up', or 'down'

  const mockPost = {
    title: "Check out this amazing sunset I captured!",
    author: "nature_lover",
    timePosted: "5 hours ago",
    content: "I was lucky enough to catch this incredible view during my evening hike. The colors were absolutely breathtaking!",
    commentCount: 47,
  }

  const handleVote = (direction) => {
    if (voted === direction) {
      setVoted(null)
      setVotes(direction === 'up' ? votes - 1 : votes + 1)
    } else {
      if (voted) {
        // Change vote from up to down or vice versa (counts for 2)
        setVotes(direction === 'up' ? votes + 2 : votes - 2)
      } else {
        // New vote
        setVotes(direction === 'up' ? votes + 1 : votes - 1)
      }
      setVoted(direction)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 max-w-2xl">
      {/* Vote Section */}
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleVote('up')}
            className={`p-1 ${voted === 'up' ? 'text-accent' : 'text-gray-400'} hover:text-accent`}
          >
            <FaArrowUp size={20} />
          </motion.button>
          <span className="text-sm font-medium my-1">{votes}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleVote('down')}
            className={`p-1 ${voted === 'down' ? 'text-accent' : 'text-gray-400'} hover:text-accent`}
          >
            <FaArrowDown size={20} />
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            Posted by u/{mockPost.author} {mockPost.timePosted}
          </div>
          <h2 className="text-lg font-medium mb-2">{mockPost.title}</h2>
          <p className="text-gray-700 mb-4">{mockPost.content}</p>

          {/* Actions Section */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
              <FaComment size={16} />
              <span className="text-sm">{mockPost.commentCount} Comments</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
              <FaShare size={16} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard