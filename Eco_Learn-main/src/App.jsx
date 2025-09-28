import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/Auth/Login.jsx';
import OnboardingSurvey from './components/Auth/OnboardingSurvey.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import StudentDashboard from './components/Dashboard/StudentDashboard.jsx';
import ChallengesList from './components/Challenges/ChallengesList.jsx';
import PersonalizedChallenges from './components/Challenges/PersonalizedChallenges.jsx';
import Leaderboard from './components/Leaderboard/Leaderboard.jsx';
import SocialFeed from './components/Social/SocialFeed.jsx';
import TeacherDashboard from './components/Teacher/TeacherDashboard.jsx';
import InstitutionRegistration from './components/Teacher/InstitutionRegistration.jsx';
import NGODashboard from './components/NGO/NGODashboard.jsx';
import EcoGames from './components/Games/EcoGames.jsx';
import LearningModule from './components/Learning/LearningModule.jsx';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  if (user?.role === 'student' && !user?.hasCompletedOnboarding) {
    return <OnboardingSurvey />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (user?.role === 'teacher') return <TeacherDashboard />;
        if (user?.role === 'ngo') return <NGODashboard />;
        return <StudentDashboard />;
      case 'challenges':
        return <ChallengesList />;
      case 'personalized':
        return <PersonalizedChallenges />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'social':
        return <SocialFeed />;
      case 'games':
        return <EcoGames />;
      case 'learning':
        return <LearningModule />;
      case 'register-institution':
        return <InstitutionRegistration />;
      case 'verify':
        return <TeacherDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

