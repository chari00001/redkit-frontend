"use client";

import React, { useState } from "react";
import {
  FaReddit,
  FaSearch,
  FaPlus,
  FaComments,
  FaBell,
  FaTrophy,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaInfoCircle,
  FaTshirt,
  FaMedal,
  FaMoon,
  FaAd,
  FaCrown,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Auth from "./Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const router = useRouter();

  const mockNotifications = [
    { id: 1, text: "Someone replied to your post", time: "2m ago" },
    { id: 2, text: "Your post received 100 upvotes!", time: "1h ago" },
    { id: 3, text: "New message from user123", time: "3h ago" },
  ];

  const mockGroups = [
    {
      id: 1,
      name: "Web Development",
      lastMessage: "Check out this new framework!",
      time: "2m ago",
      unread: 3,
    },
    {
      id: 2,
      name: "Gaming Club",
      lastMessage: "Anyone up for multiplayer?",
      time: "1h ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Photography",
      lastMessage: "Beautiful sunset shots!",
      time: "3h ago",
      unread: 1,
    },
  ];

  const mockPersons = [
    {
      id: 1,
      name: "John Doe",
      status: "online",
      lastMessage: "Hey, how's it going?",
      time: "5m ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Alice Smith",
      status: "offline",
      lastMessage: "Thanks for the help!",
      time: "2h ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Bob Wilson",
      status: "online",
      lastMessage: "See you tomorrow!",
      time: "1d ago",
      unread: 0,
    },
    {
      id: 4,
      name: "Emma Davis",
      status: "online",
      lastMessage: "Great idea!",
      time: "2d ago",
      unread: 1,
    },
  ];

  const mockConversations = [
    ["Hey!", "Hi there!", "How are you?", "I'm good, thanks!", "What's new?"],
    [
      "Did you see the latest update?",
      "Yes! It's amazing!",
      "The new features are great",
      "I agree!",
    ],
    [
      "Want to join our project?",
      "Sure!",
      "When do we start?",
      "How about tomorrow?",
    ],
    [
      "Nice weather today!",
      "Perfect for coding!",
      "Or for a walk!",
      "Why not both?",
    ],
  ];

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    // Pick a random conversation
    const randomConversation =
      mockConversations[Math.floor(Math.random() * mockConversations.length)];
    setChatMessages(randomConversation);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/logo.png" alt="RedKit Logo" className="w-8" />
          <span className="text-xl font-bold text-black">RedKit</span>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className={`relative max-w-xl w-full mx-4 ${
            searchFocused ? "flex-grow" : ""
          }`}
          animate={{ width: searchFocused ? "100%" : "40%" }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#D20103] transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </motion.div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <motion.button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Create Post"
            onClick={() => router.push("/createPost")}
          >
            <FaPlus size={20} />
          </motion.button>

          <motion.button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <FaComments size={20} />
          </motion.button>

          <div className="relative">
            <motion.button
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FaBell size={20} />
            </motion.button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <motion.button
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Profile"
            >
              <FaUserCircle size={20} />
            </motion.button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-black">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaUserCircle size={16} />
                  <span>View Profile</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaTshirt size={16} />
                  <span>Edit Avatar</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaTrophy size={16} />
                  <span>Achievements</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaMedal size={16} />
                  <span>Contributor Program</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaMoon size={16} />
                  <span>Dark Mode</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaSignOutAlt size={16} />
                  <span>Log Out</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaAd size={16} />
                  <span>Advertise on Reddit</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaCog size={16} />
                  <span>Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                  <FaCrown size={16} />
                  <span>Premium</span>
                </button>
              </div>
            )}
          </div>

          <motion.button
            className="px-6 py-1.5 text-[#D20103] hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAuthMode("login");
              setShowAuth(true);
            }}
          >
            Log In
          </motion.button>
          <motion.button
            className="px-6 py-1.5 bg-[#D20103] text-white rounded-full hover:bg-[#D20103] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAuthMode("register");
              setShowAuth(true);
            }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>

      <Auth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />

      {/* Enhanced Chat Modal */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            {activeChat ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChat(null)}
                  className="text-gray-700 hover:bg-gray-200 rounded-full p-1"
                >
                  <FaArrowLeft size={16} />
                </button>
                <h3 className="font-semibold text-gray-800">
                  {activeChat.name}
                </h3>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-800">Messages</h3>
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="px-2 py-1 text-sm rounded border bg-white"
                />
              </>
            )}
          </div>

          {!activeChat ? (
            <div className="flex-1 overflow-y-auto">
              {/* Groups Section */}
              <div className="p-2">
                <h4 className="text-xs font-semibold text-gray-500 px-2 mb-2">
                  GROUPS
                </h4>
                {mockGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex justify-between items-start"
                    onClick={() => handleChatClick(group)}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {group.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400">
                        {group.time}
                      </span>
                      {group.unread > 0 && (
                        <span className="bg-[#D20103] text-white text-xs rounded-full px-2 mt-1">
                          {group.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Messages Section */}
              <div className="p-2">
                <h4 className="text-xs font-semibold text-gray-500 px-2 mb-2">
                  DIRECT MESSAGES
                </h4>
                {mockPersons.map((person) => (
                  <div
                    key={person.id}
                    className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex justify-between items-start"
                    onClick={() => handleChatClick(person)}
                  >
                    <div className="flex gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                            person.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {person.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400">
                        {person.time}
                      </span>
                      {person.unread > 0 && (
                        <span className="bg-[#D20103] text-white text-xs rounded-full px-2 mt-1">
                          {person.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "ml-auto bg-[#D20103] text-white"
                      : "mr-auto bg-white text-gray-800"
                  } max-w-[80%] rounded-lg p-2 text-sm shadow-sm`}
                >
                  {message}
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border-t bg-white">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 rounded-full border focus:outline-none focus:ring-1 focus:ring-[#D20103] bg-gray-50"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
