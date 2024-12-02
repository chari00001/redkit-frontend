"use client"

import React, { useState } from 'react'
import { FaImage, FaLink } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const CreatePost = () => {
  const [postType, setPostType] = useState('text') // text, image, or link
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [link, setLink] = useState('')

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle post submission here
    // For now just redirect back
    router.push('/')
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Create a Post</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Post Type Selector */}
        <div className="flex gap-4 mb-6 border-b pb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full ${postType === 'text' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setPostType('text')}
          >
            Text
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${postType === 'image' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setPostType('image')}
          >
            <FaImage /> Image
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${postType === 'link' ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setPostType('link')}
          >
            <FaLink /> Link
          </motion.button>
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-100 text-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {postType === 'text' && (
            <textarea
              placeholder="Text (optional)"
              className="w-full p-2 mb-4 border rounded-lg h-32 focus:ring-2 focus:ring-accent outline-none bg-gray-100 text-gray-700"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {postType === 'image' && (
            <input
              type="url"
              placeholder="Image URL"
              className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-100 text-gray-700"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          )}

          {postType === 'link' && (
            <input
              type="url"
              placeholder="URL"
              className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-100 text-gray-700"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          )}

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
              onClick={() => router.push('/')}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 rounded-full bg-accent text-white"
            >
              Post
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost