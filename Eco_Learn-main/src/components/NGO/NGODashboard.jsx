import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  mockCampaigns,
  mockSubmissions,
  mockUsers,
} from "../../data/mockData.js";
import {
  Heart,
  TreePine,
  Recycle,
  Droplet,
  BarChart3,
  Award,
  Users,
  CheckCircle,
} from "lucide-react";

const NGODashboard = () => {
  useAuth();

  const impactStats = [
    {
      label: "Trees Planted",
      value: 1245,
      icon: TreePine,
      color: "text-green-600",
      bg: "bg-green-100",
      change: "+12%",
    },
    {
      label: "Waste Collected (kg)",
      value: 3580,
      icon: Recycle,
      color: "text-blue-600",
      bg: "bg-blue-100",
      change: "+8%",
    },
    {
      label: "Water Saved (L)",
      value: 12450,
      icon: Droplet,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      change: "+15%",
    },
    {
      label: "CO₂ Offset (kg)",
      value: 8920,
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-100",
      change: "+18%",
    },
  ];

  const partnershipStats = [
    {
      label: "Partner Schools",
      value: 45,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Active Students",
      value: 2340,
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      label: "Active Campaigns",
      value: 8,
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Verified Projects",
      value: 156,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NGO Impact Dashboard 🌍</h1>
            <p className="text-green-100 mt-1">
              Track your environmental campaigns and school partnerships
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">January 2025</p>
            <p className="text-green-200 text-sm">Monthly Report</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Environmental Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Partnership Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partnershipStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text_gray-800">
              Active Campaigns
            </h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Create Campaign
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockCampaigns.map((campaign) => (
            <div key={campaign.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {campaign.goals.map((goal, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-800">
                          {goal.metric}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {goal.target.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Start: {new Date(campaign.startDate).toLocaleDateString()}
                    </span>
                    <span>
                      End: {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-600"
                          : campaign.status === "draft"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <div className="ml-6">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Verifications
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockSubmissions
            .filter((s) => s.status === "approved")
            .slice(0, 5)
            .map((submission) => {
              const student = mockUsers.find((u) => u.id === submission.userId);
              return (
                <div
                  key={submission.id}
                  className="p-4 flex items-center space-x-4"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <img
                    src={submission.proofUrl}
                    alt="Verification proof"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {student?.name} - Environmental Project
                    </p>
                    <p className="text-sm text-gray-500">
                      Verified on{" "}
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                    +{submission.pointsAwarded} pts
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Generate Report</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Download comprehensive impact reports for donors and partners
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
            Download Report
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Partner Schools</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Manage partnerships and onboard new schools to your campaigns
          </p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-full">
            Manage Partners
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Issue Certificates</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Generate and distribute digital certificates to outstanding
            participants
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors w-full">
            Create Certificates
          </button>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
