import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Leaf, User, Lock, AlertCircle } from 'lucide-react';
import SignupForm from './SignupForm.jsx';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const demoAccounts = [
    { role: 'student', email: 'arjun@student.com', name: 'Arjun Kumar' },
    { role: 'teacher', email: 'priya@teacher.com', name: 'Priya Sharma' },
    { role: 'admin', email: 'rajesh@admin.com', name: 'Dr. Rajesh Verma' },
    { role: 'ngo', email: 'ngo@greenworld.org', name: 'Green World NGO', password: 'demo123' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, selectedRole);
      if (!success) {
        setError('Invalid credentials or role mismatch');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return '👨‍🎓';
      case 'teacher': return '👩‍🏫';
      case 'admin': return '👨‍💼';
      case 'ngo': return '🌍';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'from-blue-500 to-cyan-500';
      case 'teacher': return 'from-green-500 to-emerald-500';
      case 'admin': return 'from-purple-500 to-indigo-500';
      case 'ngo': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isLogin) {
    return <SignupForm onBackToLogin={() => setIsLogin(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-8 text-white flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <Leaf className="h-10 w-10" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold">EcoLearn</h1>
                  <p className="text-green-100">Gamified Eco Education</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🌱 Real Impact</h3>
                <p className="text-green-100 text-sm">Complete real-world environmental challenges and make a difference</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🎮 Gamified Learning</h3>
                <p className="text-green-100 text-sm">Earn points, badges, and compete with classmates while learning</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📊 Track Progress</h3>
                <p className="text-green-100 text-sm">Monitor your environmental impact and academic progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to continue your eco-journey</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
              <div className="grid grid-cols-4 gap-2">
                {['student', 'teacher', 'admin', 'ngo'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedRole === role 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getRoleIcon(role)}</div>
                    <div className="text-xs font-medium text-gray-700 capitalize">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : `bg-gradient-to-r ${getRoleColor(selectedRole)} text-white hover:shadow-lg`
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8">
              <div className="text-center text-sm text-gray-500 mb-4">Try Demo Accounts</div>
              <div className="grid grid-cols-1 gap-2">
                {demoAccounts.map(account => (
                  <button
                    key={account.role}
                    onClick={() => handleDemoLogin(account.email)}
                    className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getRoleIcon(account.role)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

