import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockSubmissions, mockUsers, mockChallenges } from '../../data/mockData.js';
import { CheckCircle, XCircle, Clock, Users, Award, TrendingUp } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  
  const students = mockUsers.filter(u => u.role === 'student' && u.schoolId === user?.schoolId);
  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending');
  const approvedSubmissions = mockSubmissions.filter(s => s.status === 'approved' && s.verifierId === user?.id);
  const totalPoints = students.reduce((sum, student) => sum + student.points, 0);

  const stats = [
    { label: 'Students in Class', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Submissions', value: pendingSubmissions.length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Approved This Month', value: approvedSubmissions.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Class Total Points', value: totalPoints, icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  const getStudentById = (userId) => students.find(s => s.id === userId);
  const getChallengeById = (challengeId) => mockChallenges.find(c => c.id === challengeId);

  const handleApprove = (submissionId) => {
    console.log('Approving submission:', submissionId);
  };

  const handleReject = (submissionId) => {
    console.log('Rejecting submission:', submissionId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}! 👩‍🏫</h1>
        <p className="text-green-100 mt-1">Manage your class and inspire the next generation of eco-warriors</p>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Pending Submissions</h2>
            <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
              {pendingSubmissions.length} waiting
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pendingSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending submissions to review</p>
            </div>
          ) : (
            pendingSubmissions.map(submission => {
              const student = getStudentById(submission.userId);
              const challenge = getChallengeById(submission.challengeId);
              if (!student || !challenge) return null;
              return (
                <div key={submission.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <img src={submission.proofUrl} alt="Submission proof" className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-800">{student.name}</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm font-medium text-blue-600">{challenge.title}</span>
                        </div>
                        <p className="text-gray-600 mb-2">{challenge.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Submitted: {new Date(submission.timestamp).toLocaleDateString()}</span>
                          <span>Points: {challenge.points}</span>
                          {submission.latitude && submission.longitude && (
                            <span>📍 GPS verified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleReject(submission.id)} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2">
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button onClick={() => handleApprove(submission.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {students
              .sort((a, b) => b.points - a.points)
              .slice(0, 5)
              .map((student, index) => (
                <div key={student.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">Level {student.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{student.points} pts</p>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>{student.streakCount} streak</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {approvedSubmissions
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map(submission => {
                const student = getStudentById(submission.userId);
                const challenge = getChallengeById(submission.challengeId);
                if (!student || !challenge) return null;
                return (
                  <div key={submission.id} className="p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{student.name}</span> completed{' '}
                        <span className="font-medium text-blue-600">{challenge.title}</span>
                      </p>
                      <p className="text-xs text-gray-500">{new Date(submission.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{submission.pointsAwarded} pts</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

