import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { onboardingQuestions } from '../../data/mockData.js';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const OnboardingSurvey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const { updateUserPreferences } = useAuth();

  const question = onboardingQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === onboardingQuestions.length - 1;
  const currentAnswers = answers[question.id] || [];

  const handleAnswerSelect = (optionId) => {
    if (question.type === 'single') {
      setAnswers({ ...answers, [question.id]: [optionId] });
    } else {
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      setAnswers({ ...answers, [question.id]: newAnswers });
    }
  };

  const handleNext = () => {
    if (currentAnswers.length === 0) return;
    if (isLastQuestion) {
      handleComplete();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    const preferences = {
      interests: answers.interests || [],
      timeCommitment: (answers.time_commitment && answers.time_commitment[0]) || '30_mins',
      location: (answers.location && answers.location[0]) || 'urban',
      ecoFocus: answers.eco_focus || []
    };
    updateUserPreferences(preferences);
  };

  const getOptionLabel = (optionId) => {
    for (const q of onboardingQuestions) {
      const option = q.options.find(opt => opt.id === optionId);
      if (option) return option.label;
    }
    return optionId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Quick Preferences Survey</h1>
              <span className="text-sm text-gray-500">{currentQuestion + 1} of {onboardingQuestions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / onboardingQuestions.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map(option => {
                const isSelected = currentAnswers.includes(option.id);
                return (
                  <button key={option.id} onClick={() => handleAnswerSelect(option.id)} className={`p-4 rounded-lg border-2 transition-all text-left ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1"><p className="font-medium text-gray-800">{option.label}</p></div>
                      {isSelected && <Check className="h-5 w-5 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {question.type === 'multiple' && <p className="text-sm text-gray-500 mt-4">💡 You can select multiple options</p>}
          </div>

          <div className="flex justify-between items-center">
            <button onClick={handlePrevious} disabled={currentQuestion === 0} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentQuestion === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <div className="text-center">
              {currentAnswers.length > 0 && <p className="text-sm text-green-600 mb-2">✓ {currentAnswers.map(getOptionLabel).join(', ')}</p>}
            </div>
            <button onClick={handleNext} disabled={currentAnswers.length === 0 || isCompleting} className={`flex items-center space-x-2 px-6 py-2 rounded-lg font_medium transition-colors ${currentAnswers.length === 0 || isCompleting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'}`}>
              <span>{isCompleting ? 'Completing...' : isLastQuestion ? 'Complete' : 'Next'}</span>
              {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button onClick={handleComplete} className="text-sm text-gray-500 hover:text-gray-700">Skip survey and continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSurvey;

