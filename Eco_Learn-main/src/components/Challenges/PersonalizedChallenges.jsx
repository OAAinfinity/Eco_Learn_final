import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockChallenges } from '../../data/mockData.js';
import ChallengeCard from './ChallengeCard.jsx';
import { Target, Sparkles } from 'lucide-react';

const PersonalizedChallenges = () => {
  const { user } = useAuth();

  const getPersonalizedChallenges = () => {
    if (!user?.preferences) return [];

    const userInterests = [
      ...(user.preferences.interests || []),
      ...(user.preferences.ecoFocus || [])
    ];

    return mockChallenges.filter(challenge => {
      const gradeMatch = challenge.gradeLevels.includes(user.gradeLevel) || challenge.gradeLevels.includes('all');
      const interestMatch = challenge.personalizedFor?.some(interest => 
        userInterests.some(userInterest => 
          userInterest.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(userInterest.toLowerCase())
        )
      );
      const timeMatch = user.preferences.timeCommitment === '1_hour_plus' || 
                      challenge.difficulty !== 'hard';
      const locationMatch = user.preferences.location === 'rural' ? 
                           challenge.title.toLowerCase().includes('rural') || 
                           challenge.category.includes('Water') :
                           true;
      return gradeMatch && (interestMatch || locationMatch) && timeMatch;
    }).slice(0, 6);
  };

  const personalizedChallenges = getPersonalizedChallenges();

  const getRecommendationReason = (challenge) => {
    if (!user?.preferences) return 'Recommended for you';

    const userInterests = [
      ...(user.preferences.interests || []),
      ...(user.preferences.ecoFocus || [])
    ];

    const matchingInterests = challenge.personalizedFor?.filter((interest) =>
      userInterests.some(userInterest => 
        userInterest.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(userInterest.toLowerCase())
      )
    );

    if (matchingInterests && matchingInterests.length > 0) {
      return `Matches your interest in ${matchingInterests[0]}`;
    }

    if (user.preferences.location === 'rural' && challenge.title.toLowerCase().includes('rural')) {
      return 'Perfect for rural areas';
    }

    if (user.preferences.timeCommitment === '15_mins' && challenge.difficulty === 'easy') {
      return 'Quick and easy to complete';
    }

    return 'Recommended for you';
  };

  if (!user?.hasCompletedOnboarding) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Complete Your Profile</h3>
        <p className="text-gray-600 mb-4">
          Complete the preference survey to get personalized challenge recommendations!
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Complete Survey
        </button>
      </div>
    );
  }

  if (personalizedChallenges.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Personalized Challenges</h3>
        <p className="text-gray-600">
          We couldn't find challenges matching your preferences. Check out all available challenges!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Sparkles className="h-8 w-8" />
          <span>Personalized for You</span>
        </h1>
        <p className="text-purple-100 mt-1">
          Challenges tailored to your interests and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Preferences</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Interests</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.preferences?.interests?.map((interest, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Time Commitment</p>
            <p className="text-sm text-gray-800 mt-1">{String(user.preferences?.timeCommitment).replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Location</p>
            <p className="text-sm text-gray-800 mt-1 capitalize">{user.preferences?.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Eco Focus</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.preferences?.ecoFocus?.map((focus, index) => (
                <span key={index} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  {focus}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recommended Challenges</h2>
          <p className="text-gray-600 mt-1">Based on your interests and preferences</p>
        </div>
        
        <div className="p-6 space-y-6">
          {personalizedChallenges.map(challenge => (
            <div key={challenge.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>For You</span>
                </div>
              </div>
              
              <ChallengeCard challenge={challenge} />
              
              <div className="mt-2 text-sm text-purple-600 font-medium">
                💡 {getRecommendationReason(challenge)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Get Better Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">Complete more challenges</p>
            <p>The more you participate, the better we understand your preferences</p>
          </div>
          <div>
            <p className="font-medium mb-1">Update your preferences</p>
            <p>Your interests might change - update them anytime in settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedChallenges;

