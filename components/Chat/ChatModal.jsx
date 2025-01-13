import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaSearch,
  FaPaperPlane,
  FaSmile,
  FaImage,
  FaEllipsisV,
  FaTimes,
} from "react-icons/fa";

const ChatModal = ({ show, onClose }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const mockGroups = [
    {
      id: 1,
      name: "Web Development",
      lastMessage: "Check out this new framework!",
      time: "2m ago",
      unread: 3,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Gaming Club",
      lastMessage: "Anyone up for multiplayer?",
      time: "1h ago",
      unread: 0,
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Photography",
      lastMessage: "Beautiful sunset shots!",
      time: "3h ago",
      unread: 1,
      avatar: "https://i.pravatar.cc/150?img=3",
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
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 2,
      name: "Alice Smith",
      status: "offline",
      lastMessage: "Thanks for the help!",
      time: "2h ago",
      unread: 0,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      name: "Bob Wilson",
      status: "online",
      lastMessage: "See you tomorrow!",
      time: "1d ago",
      unread: 0,
      avatar: "https://i.pravatar.cc/150?img=6",
    },
  ];

  const mockConversations = [
    {
      id: 1,
      messages: [
        { id: 1, text: "Hey!", sender: "me", time: "10:00" },
        { id: 2, text: "Hi there!", sender: "other", time: "10:01" },
        { id: 3, text: "How are you?", sender: "me", time: "10:02" },
        {
          id: 4,
          text: "I'm doing great, thanks for asking!",
          sender: "other",
          time: "10:03",
        },
      ],
    },
  ];

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    setChatMessages(mockConversations[0].messages);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");
  };

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPersons = mockPersons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        {activeChat ? (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveChat(null)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            >
              <FaArrowLeft size={16} />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-8 h-8 rounded-full"
                />
                {activeChat.status && (
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                      activeChat.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    } border-2 border-white`}
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {activeChat.name}
                </h3>
                {activeChat.status && (
                  <span className="text-xs text-gray-500 capitalize">
                    {activeChat.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800">Mesajlar</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </motion.button>
          </>
        )}
      </div>

      {!activeChat ? (
        <>
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Mesajlarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {/* Groups */}
            {filteredGroups.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                  GRUPLAR
                </h4>
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleChatClick(group)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold text-gray-800">
                            {group.name}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {group.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {group.lastMessage}
                        </p>
                      </div>
                      {group.unread > 0 && (
                        <span className="bg-accent text-white text-xs rounded-full px-2 py-1">
                          {group.unread}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Direct Messages */}
            {filteredPersons.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                  KİŞİLER
                </h4>
                {filteredPersons.map((person) => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleChatClick(person)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                            person.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          } border-2 border-white`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold text-gray-800">
                            {person.name}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {person.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {person.lastMessage}
                        </p>
                      </div>
                      {person.unread > 0 && (
                        <span className="bg-accent text-white text-xs rounded-full px-2 py-1">
                          {person.unread}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.sender === "me"
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span
                    className={`text-xs ${
                      message.sender === "me"
                        ? "text-white/80"
                        : "text-gray-500"
                    } block mt-1`}
                  >
                    {message.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <FaSmile size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <FaImage size={20} />
              </motion.button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesaj yaz..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 text-accent hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane size={20} />
              </motion.button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ChatModal;
