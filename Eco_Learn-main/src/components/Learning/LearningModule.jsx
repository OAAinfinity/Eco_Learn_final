import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockLessons, mockStudentLessons } from '../../data/mockData.js';
import { BookOpen, Clock, Award, Play, CheckCircle, Star } from 'lucide-react';

const LearningModule = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const availableLessons = mockLessons.filter(lesson => 
    lesson.gradeLevels.includes(user?.gradeLevel || '') || lesson.gradeLevels.includes('all')
  );

  const getUserLessonProgress = (lessonId) => {
    return mockStudentLessons.find(sl => sl.userId === user?.id && sl.lessonId === lessonId);
  };

  const selectedLessonData = mockLessons.find(l => l.id === selectedLesson);

  const handleStartLesson = (lessonId) => {
    setSelectedLesson(lessonId);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setShowResults(false);
  };

  const handleQuizAnswer = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (selectedLessonData?.quiz && currentQuizQuestion < selectedLessonData.quiz.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!selectedLessonData?.quiz) return 0;
    let correct = 0;
    selectedLessonData.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.answer) {
        correct++;
      }
    });
    return Math.round((correct / selectedLessonData.quiz.length) * 100);
  };

  const handleCompleteLesson = () => {
    const score = calculateScore();
    console.log('Lesson completed with score:', score);
    if (score >= 70) {
      console.log('Points awarded:', selectedLessonData?.points || 10);
    }
    setSelectedLesson(null);
  };

  const getDifficultyColor = (gradeLevel) => {
    if (gradeLevel.includes('primary')) return 'text-green-600 bg-green-100';
    if (gradeLevel.includes('secondary')) return 'text-blue-600 bg-blue-100';
    if (gradeLevel.includes('senior')) return 'text-purple-600 bg-purple-100';
    if (gradeLevel.includes('college')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (progress) => {
    if (!progress) return <Play className="h-4 w-4" />;
    if (progress.status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  if (selectedLesson && selectedLessonData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedLesson(null)} className="text-blue-500 hover:text-blue-600 transition-colors">← Back to Lessons</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedLessonData.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{selectedLessonData.estimatedTime}</span></span>
              <span className="flex items-center space-x-1"><Award className="h-4 w-4" /><span>{selectedLessonData.points || 10} points</span></span>
            </div>
          </div>

          {!showResults && currentQuizQuestion === 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
              <div className="prose max-w-none"><p className="text-gray-700 leading-relaxed">{selectedLessonData.content}</p></div>
              {selectedLessonData.mediaUrl && (
                <div className="mt-4"><img src={selectedLessonData.mediaUrl} alt={selectedLessonData.title} className="w-full h-48 object-cover rounded-lg" /></div>
              )}
              <div className="mt-6">
                <button onClick={() => setCurrentQuizQuestion(0)} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">Start Quiz</button>
              </div>
            </div>
          )}

          {selectedLessonData.quiz && !showResults && currentQuizQuestion >= 0 && (
            <div className="mb-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Quiz</h3>
                  <span className="text-sm text-gray-500">Question {currentQuizQuestion + 1} of {selectedLessonData.quiz.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuizQuestion + 1) / selectedLessonData.quiz.length) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">{selectedLessonData.quiz[currentQuizQuestion].q}</h4>
                <div className="space-y-3">
                  {selectedLessonData.quiz[currentQuizQuestion].options.map((option, index) => (
                    <button key={index} onClick={() => handleQuizAnswer(option)} className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showResults && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white text-center">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                <p className="text-lg mb-4">Your Score: {calculateScore()}%</p>
                {calculateScore() >= 70 ? (
                  <div>
                    <p className="mb-4">🎉 Congratulations! You've earned {selectedLessonData.points || 10} points!</p>
                    <button onClick={handleCompleteLesson} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Complete Lesson</button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">You need 70% to pass. Try again!</p>
                    <button onClick={() => { setCurrentQuizQuestion(0); setQuizAnswers([]); setShowResults(false); }} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Retry Quiz</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center space-x-2"><BookOpen className="h-8 w-8" /><span>Learning Modules</span></h1>
        <p className="text-blue-100 mt-1">Expand your environmental knowledge with interactive lessons</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{mockStudentLessons.filter(sl => sl.userId === user?.id && sl.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{mockStudentLessons.filter(sl => sl.userId === user?.id && sl.status === 'in_progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{(mockStudentLessons.filter(sl => sl.userId === user?.id && sl.status === 'completed').reduce((sum, sl) => sum + (sl.score || 0), 0) / Math.max(1, mockStudentLessons.filter(sl => sl.userId === user?.id && sl.status === 'completed').length)) || 0}%</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{mockStudentLessons.filter(sl => sl.userId === user?.id && sl.status === 'completed').length * 10}</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Available Lessons</h2>
          <p className="text-gray-600 mt-1">Lessons for {user?.gradeLevel} level</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {availableLessons.map(lesson => {
            const progress = getUserLessonProgress(lesson.id);
            return (
              <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(lesson.gradeLevels)}`}>{lesson.gradeLevels.join(', ')}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{lesson.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{lesson.estimatedTime}</span></span>
                      <span className="flex items-center space-x-1"><Award className="h-4 w-4" /><span>{lesson.points || 10} points</span></span>
                      <span>Theme: {lesson.ncertTheme}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.sdgTags.map((tag, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                    {progress && progress.status === 'completed' && (
                      <div className="text-sm text-green-600 mb-2">✓ Completed with {progress.score}% score</div>
                    )}
                  </div>
                  <div className="ml-6">
                    <button onClick={() => handleStartLesson(lesson.id)} className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      {getStatusIcon(progress)}
                      <span>{!progress ? 'Start' : progress.status === 'completed' ? 'Review' : 'Continue'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningModule;

