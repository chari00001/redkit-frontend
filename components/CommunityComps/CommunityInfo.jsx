import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaRegClock,
  FaHashtag,
  FaShieldAlt,
  FaGlobe,
  FaLock,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const CommunityInfo = ({ communityId }) => {
  const { currentCommunity, loading, error } = useSelector(
    (state) => state.communities
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error || !currentCommunity) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-red-500">Topluluk bilgileri yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        r/{currentCommunity.name}
      </h3>

      <p className="text-gray-600 mb-4">{currentCommunity.description}</p>

      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaUsers className="text-gray-400" />
          <span>
            {currentCommunity.member_count?.toLocaleString() || 0} üye
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaHashtag className="text-gray-400" />
          <span>{currentCommunity.post_count || 0} gönderi</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaRegClock className="text-gray-400" />
          <span>
            {new Date(currentCommunity.created_at).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            tarihinde oluşturuldu
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {currentCommunity.visibility === "public" ? (
            <>
              <FaGlobe className="text-gray-400" />
              <span>Herkese Açık</span>
            </>
          ) : currentCommunity.visibility === "private" ? (
            <>
              <FaLock className="text-gray-400" />
              <span>Özel</span>
            </>
          ) : (
            <>
              <FaShieldAlt className="text-gray-400" />
              <span>Kısıtlı</span>
            </>
          )}
        </div>
      </div>

      {currentCommunity.tags && currentCommunity.tags.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <h4 className="font-medium text-gray-900 mb-2">Etiketler</h4>
          <div className="flex flex-wrap gap-2">
            {currentCommunity.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {currentCommunity.rules && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <h4 className="font-medium text-gray-900 mb-2">Kurallar</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            {currentCommunity.rules
              .split("\n")
              .filter(Boolean)
              .map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
          </ol>
        </div>
      )}

      {isLoggedIn && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 bg-accent text-white rounded-lg font-medium"
          >
            {currentCommunity.is_member
              ? "Topluluktan Ayrıl"
              : "Topluluğa Katıl"}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CommunityInfo;
