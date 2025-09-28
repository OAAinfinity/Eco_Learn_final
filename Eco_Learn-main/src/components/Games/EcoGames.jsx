import React, { useState } from 'react';
import { Play, Trophy, Zap, TreePine, Calculator } from 'lucide-react';

const EcoGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [carbonQuizScore, setCarbonQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const games = [
    { id: 'carbon-quest', title: 'Carbon Footprint Quest', description: 'Make daily choices and see their environmental impact. Learn to reduce your carbon footprint!', icon: Calculator, difficulty: 'Easy', points: 25, color: 'from-blue-500 to-cyan-500' },
    { id: 'eco-mission-adventure', title: 'Eco Mission Adventure', description: 'Unlock map locations by completing real-world environmental missions!', icon: TreePine, difficulty: 'Medium', points: 50, color: 'from-green-500 to-emerald-500' },
    { id: 'sustainability-builder', title: 'Sustainability Builder', description: 'Design and build your dream eco-friendly campus or city!', icon: Trophy, difficulty: 'Hard', points: 100, color: 'from-purple-500 to-pink-500' },
    { id: 'eco-quiz-battle', title: 'Eco Quiz Battle', description: 'Test your environmental knowledge in this exciting quiz challenge!', icon: Zap, difficulty: 'Easy', points: 15, color: 'from-orange-500 to-red-500' }
  ];

  const carbonQuestions = [
    { question: "What's the most eco-friendly way to travel short distances?", options: ["Car", "Walking/Cycling", "Taxi", "Motorcycle"], correct: 1, impact: "Walking or cycling produces zero emissions!" },
    { question: "Which energy source is most sustainable?", options: ["Coal", "Natural Gas", "Solar", "Oil"], correct: 2, impact: "Solar energy is renewable and produces no direct emissions!" },
    { question: "What's the biggest contributor to household carbon footprint?", options: ["Electronics", "Heating/Cooling", "Food", "Water"], correct: 1, impact: "Home energy use accounts for about 42% of household emissions!" }
  ];

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    if (gameId === 'carbon-quest') {
      setCurrentQuestion(0);
      setCarbonQuizScore(0);
    }
  };

  const handleQuizAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === carbonQuestions[currentQuestion].correct;
    if (isCorrect) {
      setCarbonQuizScore(carbonQuizScore + 10);
    }
    if (currentQuestion < carbonQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completed! Your score: ${carbonQuizScore + (isCorrect ? 10 : 0)}/${carbonQuestions.length * 10}`);
      setSelectedGame(null);
    }
  };

  const renderCarbonQuest = () => {
    if (currentQuestion >= carbonQuestions.length) return null;
    const question = carbonQuestions[currentQuestion];
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Carbon Footprint Quest</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {carbonQuestions.length}</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">Score: {carbonQuizScore}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion) / carbonQuestions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">{question.question}</h4>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button key={index} onClick={() => handleQuizAnswer(index)} className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-700">💡 <strong>Did you know?</strong> {question.impact}</p>
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    switch (selectedGame) {
      case 'carbon-quest':
        return renderCarbonQuest();
      case 'eco-mission-adventure':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">Eco Mission Adventure</h3>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <TreePine className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">Complete Real Missions to Unlock!</h4>
              <p className="text-gray-600 mb-4">This adventure map unlocks as you complete real-world environmental challenges. Plant trees, clean beaches, or reduce waste to explore new locations!</p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">View Available Missions</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedGame(null)} className="text-blue-500 hover:text-blue-600 transition-colors">← Back to Games</button>
        </div>
        {renderGameContent()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center space-x-2"><Trophy className="h-8 w-8" /><span>Eco Games</span></h1>
        <p className="text-indigo-100 mt-1">Learn through play! Complete games to earn extra points and knowledge</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {games.map(game => {
          const Icon = game.icon;
          return (
            <div key={game.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`bg-gradient-to-r ${game.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-12 w-12" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">+{game.points}</p>
                    <p className="text-sm opacity-90">Points</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{game.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${game.difficulty === 'Easy' ? 'bg-green-100 text-green-600' : game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{game.difficulty}</span>
                </div>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <button onClick={() => handleGameSelect(game.id)} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Play Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Tips & Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-3"><Calculator className="h-6 w-6 text-blue-500" /></div>
            <h3 className="font-medium text-gray-800 mb-2">Learn While Playing</h3>
            <p className="text-sm text-gray-600">Each game teaches real environmental concepts and sustainable practices</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-3"><Trophy className="h-6 w-6 text-green-500" /></div>
            <h3 className="font-medium text-gray-800 mb-2">Earn Extra Points</h3>
            <p className="text-sm text-gray-600">Games reward you with bonus points for your leaderboard ranking</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mx_auto mb-3"><Zap className="h-6 w-6 text-purple-500" /></div>
            <h3 className="font-medium text-gray-800 mb-2">Apply Knowledge</h3>
            <p className="text-sm text-gray-600">Use game insights to complete real-world environmental challenges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoGames;

