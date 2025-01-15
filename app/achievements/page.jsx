"use client";

import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaStar, FaCrown, FaAward } from "react-icons/fa";

const achievements = [
  {
    id: 1,
    title: "İlk Gönderi",
    description: "İlk gönderinizi oluşturdunuz",
    icon: <FaTrophy className="text-yellow-500" size={24} />,
    progress: 100,
    completed: true,
    reward: "100 Puan",
  },
  {
    id: 2,
    title: "Popüler Yazar",
    description: "10 gönderi oluşturdunuz",
    icon: <FaMedal className="text-blue-500" size={24} />,
    progress: 40,
    completed: false,
    reward: "500 Puan",
  },
  {
    id: 3,
    title: "Topluluk Yıldızı",
    description: "100 beğeni aldınız",
    icon: <FaStar className="text-yellow-400" size={24} />,
    progress: 75,
    completed: false,
    reward: "1000 Puan",
  },
  {
    id: 4,
    title: "Elit Üye",
    description: "30 gün boyunca her gün giriş yaptınız",
    icon: <FaCrown className="text-purple-500" size={24} />,
    progress: 20,
    completed: false,
    reward: "2000 Puan",
  },
  {
    id: 5,
    title: "Yorum Ustası",
    description: "50 yorum yaptınız",
    icon: <FaAward className="text-green-500" size={24} />,
    progress: 60,
    completed: false,
    reward: "750 Puan",
  },
];

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Başarılarım</h1>

        <div className="grid gap-6">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: achievement.id * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {achievement.title}
                    </h3>
                    <span className="text-sm font-medium text-accent">
                      {achievement.reward}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {achievement.description}
                  </p>
                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1, delay: achievement.id * 0.1 }}
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        achievement.completed ? "bg-green-500" : "bg-accent"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">İlerleme</span>
                    <span className="text-sm font-medium text-gray-700">
                      {achievement.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
