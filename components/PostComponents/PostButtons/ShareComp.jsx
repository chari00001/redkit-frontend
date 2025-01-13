import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaLink,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const ShareComp = ({ show, onClose, url = window?.location?.href }) => {
  const [copied, setCopied] = useState(false);

  const shareButtons = [
    {
      icon: FaTwitter,
      label: "Twitter",
      color: "#1DA1F2",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      icon: FaFacebook,
      label: "Facebook",
      color: "#4267B2",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
      },
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      color: "#25D366",
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
      },
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      color: "#0077B5",
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Bağlantı kopyalanırken hata oluştu:", err);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 relative"
        >
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </motion.button>

          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Gönderiyi Paylaş
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {shareButtons.map((button) => (
              <motion.button
                key={button.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.onClick}
                className="flex items-center justify-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ color: button.color }}
              >
                <button.icon size={20} />
                <span className="font-medium">{button.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 bg-transparent outline-none text-sm text-gray-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {copied ? (
                    <>
                      <FaCheck size={14} />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <FaLink size={14} />
                      <span>Kopyala</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareComp;
