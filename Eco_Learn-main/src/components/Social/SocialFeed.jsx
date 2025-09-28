import React, { useState } from "react";
import { mockPhotos, mockBlogs, mockUsers } from "../../data/mockData.js";
import {
  Heart,
  MessageCircle,
  Share,
  Camera,
  PenTool,
  Filter,
} from "lucide-react";

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState("all");

  const getUserById = (userId) => mockUsers.find((u) => u.id === userId);

  const combinedFeed = [
    ...mockPhotos.map((p) => ({ ...p, type: "photo" })),
    ...mockBlogs.map((b) => ({ ...b, type: "blog" })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredFeed = combinedFeed.filter((item) => {
    if (activeTab !== "all" && activeTab !== `${item.type}s`) return false;
    if (filter !== "all" && item.visibility !== filter) return false;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Social Feed</h1>
            <p className="text-gray-600 mt-1">
              Share your eco-journey and get inspired by others!
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Upload Photo</span>
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Write Blog</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {[
              { id: "all", label: "All Posts", icon: Filter },
              { id: "photos", label: "Photos", icon: Camera },
              { id: "blogs", label: "Blogs", icon: PenTool },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="school">School Only</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredFeed.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              Be the first to share your eco-journey!
            </p>
          </div>
        ) : (
          filteredFeed.map((item, index) => {
            const user = getUserById(item.userId);
            if (!user) return null;
            return (
              <div
                key={`${item.type}-${item.id}-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <div className="flex items_center space-x-2 text-sm text-gray-500">
                          <span>{formatDate(item.createdAt)}</span>
                          <span>•</span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              item.visibility === "public"
                                ? "bg-green-100 text-green-600"
                                : item.visibility === "school"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.visibility}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  {item.type === "photo" ? (
                    <>
                      <p className="text-gray-600 mb-4">{item.caption}</p>
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.body}
                      </p>
                      {item.mediaUrls?.length > 0 && (
                        <img
                          src={item.mediaUrls[0]}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                    </>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg_blue-100 text-blue-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm">{item.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Share className="h-5 w-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  {item.challengeId && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                      Challenge Submission
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
