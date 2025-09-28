import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Home, 
  Target, 
  Trophy, 
  Camera, 
  BookOpen, 
  Users, 
  BarChart3, 
  Award,
  MapPin,
  Calendar,
  FileText,
  Heart,
  Sparkles,
  Building
} from 'lucide-react';

const Sidebar = ({ isOpen, currentView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'challenges', label: 'Challenges', icon: Target },
      { id: 'personalized', label: 'For You', icon: Sparkles },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
      { id: 'social', label: 'Photos & Blogs', icon: Camera },
      { id: 'games', label: 'Eco Games', icon: Award },
      { id: 'learning', label: 'Learning', icon: BookOpen }
    ];

    switch (user?.role) {
      case 'teacher':
        return [
          ...commonItems.slice(0, 2),
          { id: 'register-institution', label: 'Register Institution', icon: Building },
          { id: 'verify', label: 'Verify Submissions', icon: FileText },
          { id: 'class-manage', label: 'Manage Class', icon: Users },
          ...commonItems.slice(2)
        ];
      
      case 'admin':
        return [
          ...commonItems.slice(0, 2),
          { id: 'register-institution', label: 'Register Institution', icon: Building },
          { id: 'school-analytics', label: 'School Analytics', icon: BarChart3 },
          { id: 'competitions', label: 'Competitions', icon: Calendar },
          { id: 'users-manage', label: 'Manage Users', icon: Users },
          ...commonItems.slice(2)
        ];
      
      case 'ngo':
        return [
          { id: 'dashboard', label: 'NGO Dashboard', icon: Home },
          { id: 'campaigns', label: 'Campaigns', icon: Heart },
          { id: 'impact', label: 'Impact Reports', icon: BarChart3 },
          { id: 'verify-ngo', label: 'Verify Projects', icon: FileText },
          { id: 'partnerships', label: 'School Partners', icon: Users }
        ];
      
      default: // student
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.div 
      className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col`}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                currentView === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </motion.button>
          );
        })}
      </div>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-3 text-white text-sm"
          >
            <p className="font-medium">🌍 Daily Impact</p>
            <p className="text-xs opacity-90 mt-1">You've saved 2.3kg CO₂ today!</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;

