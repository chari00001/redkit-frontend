import React from 'react'
import { FaTwitter, FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa'

const ShareComp = ({ show, onClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm">
        <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Share</h2>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
            <FaTwitter size={20} />
            <span>Twitter</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
            <FaFacebook size={20} />
            <span>Facebook</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
            <FaInstagram size={20} />
            <span>Instagram</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1">
            <FaEnvelope size={20} />
            <span>Email</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareComp