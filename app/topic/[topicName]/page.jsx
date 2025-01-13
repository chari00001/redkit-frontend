"use client";

import React from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/PostComponents/PostCard";
import { FaUsers, FaInfoCircle } from "react-icons/fa";
import { topics } from "@/mockData/topics";

const TopicPage = () => {
  const params = useParams();
  const topicName = params.topicName;
  const topic = topics.find(
    (topic) =>
      topic.name.toLowerCase() === decodeURIComponent(topicName).toLowerCase()
  );

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Konu Bulunamadı
          </h1>
          <p className="text-gray-600">
            Aradığınız konu mevcut değil veya silinmiş olabilir.
          </p>
        </div>
      </div>
    );
  }

  const mockPosts = [
    {
      id: 1,
      title: `${topic.name} hakkında düşüncelerim`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      upvotes: 1234,
      comments_count: 89,
      created_at: new Date("2024-01-21").toISOString(),
      media_url: null,
      tags: [topic.name.toLowerCase(), "discussion"],
      author: {
        username: "JohnDoe",
        profile_picture_url: "https://i.pravatar.cc/300",
        verified: true,
      },
      community: {
        id: topic.id,
        name: topic.name,
        icon: topic.icon,
      },
      is_saved: false,
      is_upvoted: false,
      allow_comments: true,
      visibility: "public",
    },
    {
      id: 2,
      title: `${topic.name} konusunda yeni gelişmeler`,
      content:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      upvotes: 856,
      comments_count: 45,
      created_at: new Date("2024-01-20").toISOString(),
      media_url: "https://picsum.photos/800/400",
      tags: [topic.name.toLowerCase(), "news"],
      author: {
        username: "JaneSmith",
        profile_picture_url: "https://i.pravatar.cc/301",
        verified: false,
      },
      community: {
        id: topic.id,
        name: topic.name,
        icon: topic.icon,
      },
      is_saved: true,
      is_upvoted: true,
      allow_comments: true,
      visibility: "public",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Topic Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{topic.icon}</span>
            <h1 className="text-3xl font-bold text-black">t/{topic.name}</h1>
          </div>
          <p className="text-gray-600 mb-4">{topic.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>{topic.memberCount || 1000} üye</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{topic.onlineCount || 100} çevrimiçi</span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              <span>
                {new Date(topic.created_at || "2024-01-01").toLocaleDateString(
                  "tr-TR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}{" "}
                tarihinde oluşturuldu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Posts Feed */}
        <div className="flex-1 space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold mb-4 text-black">
              t/{topic.name} Kuralları
            </h2>
            <ol className="space-y-3">
              {(
                topic.rules || [
                  "Saygılı ve nazik olun",
                  "Spam yapmayın",
                  "İlgisiz içerik paylaşmayın",
                  "Telif haklarına saygı gösterin",
                  "Topluluk yönergelerine uyun",
                ]
              ).map((rule, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {index + 1}. {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
