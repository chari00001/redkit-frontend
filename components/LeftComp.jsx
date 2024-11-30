"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { FaHome, FaFire, FaChartLine, FaStar, FaGamepad, FaMusic, FaFilm, FaTv, FaBook } from 'react-icons/fa'

const LeftComp = () => {
  const topics = [
    { icon: <FaHome />, text: 'Home', link: '/' },
    { icon: <FaFire />, text: 'Popular', link: '/popular' },
    { icon: <FaChartLine />, text: 'All', link: '/all' },
    { icon: <FaStar />, text: 'Best', link: '/best' }
  ]

  const interests = [
    { icon: <FaGamepad />, text: 'Gaming', link: '/topic/gaming' },
    { icon: <FaMusic />, text: 'Music', link: '/topic/music' },
    { icon: <FaFilm />, text: 'Movies', link: '/topic/movies' },
    { icon: <FaTv />, text: 'Television', link: '/topic/tv' },
    { icon: <FaBook />, text: 'Books', link: '/topic/books' }
  ]

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      {/* Topics Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">FEEDS</h3>
        <div className="space-y-1">
          {topics.map((topic, index) => (
            <motion.button
              key={index}
              className="w-full flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{topic.icon}</span>
              <span>{topic.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Interests Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">TOPICS</h3>
        <div className="space-y-1">
          {interests.map((interest, index) => (
            <motion.button
              key={index}
              className="w-full flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{interest.icon}</span>
              <span>{interest.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftComp