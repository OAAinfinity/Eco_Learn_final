import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockChallenges } from '../../data/mockData.js';
import ChallengeCard from './ChallengeCard.jsx';
import { Filter, Search } from 'lucide-react';
import { listChallenges, startChallenge } from '../../services/challenges.js';

const ChallengesList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const [challenges, setChallenges] = useState(mockChallenges);
  useEffect(() => {
    (async () => {
      const data = await listChallenges();
      setChallenges(data);
    })();
  }, []);

  const categories = [...new Set(challenges.map(c => c.category))];
  const types = [...new Set(challenges.map(c => c.type))];
  const difficulties = ['easy', 'medium', 'hard'];

  const filteredChallenges = challenges.filter(challenge => {
    const gradeMatch = challenge.gradeLevels.includes(user?.gradeLevel || '') || challenge.gradeLevels.includes('all');
    const searchMatch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
    const typeMatch = selectedType === 'all' || challenge.type === selectedType;
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    return gradeMatch && searchMatch && categoryMatch && typeMatch && difficultyMatch;
  });

  const handleStartChallenge = async (challengeId) => {
    if (!user?.id) return;
    await startChallenge(user.id, challengeId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Eco Challenges</h1>
        <p className="text-gray-600">Complete missions, projects, and quizzes to earn points and make a real impact!</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty} className="capitalize">{difficulty}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800">
            Available Challenges ({filteredChallenges.length})
          </h3>
          <div className="text-sm text-gray-500">
            Showing challenges for <span className="font-medium">{user?.gradeLevel}</span> level
          </div>
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onStartChallenge={handleStartChallenge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;

