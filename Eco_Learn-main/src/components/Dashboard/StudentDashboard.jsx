import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockChallenges, mockSubmissions, levelThresholds } from '../../data/mockData.js';
import { Target, Award, Flame, TrendingUp, Camera, BookOpen } from 'lucide-react';
import ChallengeCard from '../Challenges/ChallengeCard.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  const currentLevel = levelThresholds.find(l => 
    user && user.points >= l.minPoints && 
    (levelThresholds[l.level] ? user.points < levelThresholds[l.level].minPoints : true)
  ) || levelThresholds[0];
  
  const nextLevel = levelThresholds.find(l => l.level === currentLevel.level + 1);
  const progressPercentage = nextLevel 
    ? ((user?.points || 0) - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100
    : 100;

  const recentChallenges = mockChallenges.filter(c => 
    c.gradeLevels.includes(user?.gradeLevel || '') || c.gradeLevels.includes('all')
  ).slice(0, 3);

  const userSubmissions = mockSubmissions.filter(s => s.userId === user?.id);
  const completedChallenges = userSubmissions.filter(s => s.status === 'approved').length;
  const pendingSubmissions = userSubmissions.filter(s => s.status === 'pending').length;

  const stats = [
    { label: 'Total Points', value: user?.points || 0, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed Missions', value: completedChallenges, icon: Target, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Current Streak', value: user?.streakCount || 0, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Pending Approval', value: pendingSubmissions, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
            <p className="text-green-100 mt-1">Ready to make an impact today?</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{currentLevel.title}</p>
            <p className="text-green-200 text-sm">Level {currentLevel.level}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to next level</span>
            <span>{user?.points}/{nextLevel?.minPoints || 'MAX'} pts</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recommended Challenges</h2>
          <p className="text-gray-600 mt-1">Complete these missions to earn points and badges</p>
        </div>
        <div className="p-6 grid gap-4">
          {recentChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Camera className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Share Your Impact</h3>
          </div>
          <p className="text-gray-600 mb-4">Upload photos of your eco-activities and inspire others!</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Upload Photo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Write a Blog</h3>
          </div>
          <p className="text-gray-600 mb-4">Share your eco-journey and learnings with the community!</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Write Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

