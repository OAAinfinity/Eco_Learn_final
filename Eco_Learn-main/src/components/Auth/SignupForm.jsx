import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockInstitutions } from '../../data/mockData.js';
import { Leaf, User, Mail, Lock, School, GraduationCap, AlertCircle, ArrowLeft } from 'lucide-react';

const SignupForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    institutionCode: '',
    gradeLevel: 'secondary'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const gradeLevels = [
    { id: 'primary', label: 'Primary (6-8)', icon: '📚' },
    { id: 'secondary', label: 'Secondary (9-10)', icon: '📖' },
    { id: 'senior', label: 'Senior Secondary (11-12)', icon: '🎓' },
    { id: 'college', label: 'College/University', icon: '🏛️' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const institution = mockInstitutions.find(inst => inst.institutionCode === formData.institutionCode);
    if (!institution) {
      setError('Invalid institution code. Please check with your school/college.');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup({
        ...formData,
        schoolId: institution.id
      });
      
      if (!success) {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <button
              onClick={onBackToLogin}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </button>
            
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">Join EcoLearn</h1>
                <p className="text-gray-600">Start your eco-journey today!</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Code</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="institutionCode"
                  value={formData.institutionCode}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., GVHS123"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Get this code from your school/college admin</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {gradeLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.icon} {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
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
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Available Institution Codes:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>GVHS123</strong> - Green Valley High School</p>
              <p><strong>ABCENG2025</strong> - ABC Engineering College</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

