import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, Bell, User, LogOut, Home, Trophy, Camera, BookOpen, BarChart3 } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  
  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-500',
      teacher: 'bg-green-500',
      admin: 'bg-purple-500',
      ngo: 'bg-orange-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const getRoleIcon = (role) => {
    const icons = {
      student: Home,
      teacher: BookOpen,
      admin: BarChart3,
      ngo: Camera
    };
    const IconComponent = icons[role] || User;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </motion.button>
        <div className="flex items-center space-x-2">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-white font-bold text-xl">🌱</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">EcoLearn</h1>
            <p className="text-xs text-gray-500">Gamified Eco Education</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </motion.button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getRoleColor(user?.role || '')}`}></div>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <div className="relative group">
            <motion.button 
              whileTap={{ scale: 0.97 }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getRoleColor(user?.role || '')} text-white`}>
                {getRoleIcon(user?.role || '')}
              </div>
            </motion.button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">{user?.points} pts</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm font-medium text-green-600">Level {user?.level}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

