import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockUsers, mockSchools, levelThresholds } from '../../data/mockData.js';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [scope, setScope] = useState('school');
  const [timeFrame, setTimeFrame] = useState('monthly');

  const getLeaderboardUsers = () => {
    return mockUsers
      .filter(u => u.role === 'student')
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  };

  const leaderboardUsers = getLeaderboardUsers();
  const userRank = leaderboardUsers.findIndex(u => u.id === user?.id) + 1;
  const currentUserSchool = mockSchools.find(s => s.id === user?.schoolId);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getUserLevel = (points) => {
    return levelThresholds.reduce((acc, level) => 
      points >= level.minPoints ? level : acc
    , levelThresholds[0]);
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank <= 10) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  const getPointsChange = (userId) => {
    const changes = { '1': '+25', '2': '+15', '3': '+35' };
    return changes[userId] || `+${Math.floor(Math.random() * 30) + 5}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Trophy className="h-8 w-8" />
              <span>Leaderboard</span>
            </h1>
            <p className="text-yellow-100 mt-1">See how you rank among eco warriors</p>
          </div>
          {userRank > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold">#{userRank}</p>
              <p className="text-yellow-200">Your Rank</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="class">My Class</option>
              <option value="school">My School</option>
              <option value="region">My Region</option>
              <option value="global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
              <span className="font-medium">Current View:</span> {scope} • {timeFrame}
              {currentUserSchool && ` • ${currentUserSchool.name}`}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Top Performers</h3>
        <div className="grid grid-cols-3 gap-4">
          {leaderboardUsers.slice(0, 3).map((u, index) => {
            const rank = index + 1;
            const userLevel = getUserLevel(u.points);
            return (
              <div key={u.id} className="text-center">
                <div className={`mx-auto w-20 h-20 rounded-full ${getRankBadge(rank)} flex items-center justify-center mb-3`}>
                  {u.profileImage ? (
                    <img src={u.profileImage} alt={u.name} className="w-16 h-16 rounded-full border-2 border-white" />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-800">{u.name}</h4>
                <p className="text-sm text-gray-500">{userLevel.title}</p>
                <p className="text-lg font-bold text-blue-600">{u.points} pts</p>
                <div className="flex items-center justify-center space-x-1 text-green-600 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>{getPointsChange(u.id)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Complete Rankings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboardUsers.map((u, index) => {
            const rank = index + 1;
            const userLevel = getUserLevel(u.points);
            const isCurrentUser = u.id === user?.id;
            
            return (
              <div key={u.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 ${isCurrentUser ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex items-center space-x-3">
                    {u.profileImage ? (
                      <img src={u.profileImage} alt={u.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{u.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-sm text-gray-500">{userLevel.title} • Level {userLevel.level}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{u.points}</p>
                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>{getPointsChange(u.id)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {userRank > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
          <h3 className="text-lg font-medium mb-4">Your Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">#{userRank}</p>
              <p className="text-blue-200 text-sm">Current Rank</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user?.points}</p>
              <p className="text-blue-200 text-sm">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user?.streakCount}</p>
              <p className="text-blue-200 text-sm">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">Level {user?.level}</p>
              <p className="text-blue-200 text-sm">{getUserLevel(user?.points || 0).title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

