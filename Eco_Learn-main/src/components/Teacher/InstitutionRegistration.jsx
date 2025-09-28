import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { mockInstitutions } from '../../data/mockData.js';
import { School, Building, MapPin, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';

const InstitutionRegistration = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'school',
    location: '',
    contactEmail: '',
    contactPhone: '',
    affiliation: '',
    board: '',
    university: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateInstitutionCode = (name, type) => {
    const words = name.split(' ').filter(word => word.length > 0);
    let abbreviation = '';
    if (words.length >= 2) {
      abbreviation = words.slice(0, 3).map(word => word.charAt(0).toUpperCase()).join('');
    } else {
      abbreviation = name.substring(0, 3).toUpperCase();
    }
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${abbreviation}${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const institutionCode = generateInstitutionCode(formData.name, formData.type);
      const existingInstitution = mockInstitutions.find(inst => inst.institutionCode === institutionCode);
      if (existingInstitution) {
        throw new Error('Institution code already exists. Please try again.');
      }
      const newInstitution = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        location: formData.location,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        institutionCode,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(formData.type === 'school' ? { 
          board: formData.board,
          affiliation: formData.affiliation 
        } : { 
          university: formData.university 
        })
      };
      mockInstitutions.push(newInstitution);
      setGeneratedCode(institutionCode);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register institution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Institution Registered Successfully!</h2>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Your Institution Code</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">{generatedCode}</div>
            <p className="text-sm text-green-700">
              Share this code with students and teachers to join your institution
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share the institution code with your students and teachers</li>
              <li>• Students can use this code during signup</li>
              <li>• You can now create challenges and manage your institution</li>
              <li>• Access analytics and reports from your dashboard</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                type: 'school',
                location: '',
                contactEmail: '',
                contactPhone: '',
                affiliation: '',
                board: '',
                university: ''
              });
              setGeneratedCode('');
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Register Another Institution
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Building className="h-8 w-8" />
          <span>Register Institution</span>
        </h1>
        <p className="text-blue-100 mt-1">Create a new school or college profile on EcoLearn</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({ ...formData, type: 'school' })} className={`p-4 rounded-lg border-2 transition-colors ${formData.type === 'school' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <School className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">School</div>
                <div className="text-sm text-gray-500">K-12 Education</div>
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, type: 'college' })} className={`p-4 rounded-lg border-2 transition-colors ${formData.type === 'college' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Building className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">College</div>
                <div className="text-sm text-gray-500">Higher Education</div>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Green Valley High School" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="City, State" required />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="contact@institution.edu" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+91-9876543210" />
              </div>
            </div>
          </div>

          {formData.type === 'school' ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Board/Curriculum</label>
                <select name="board" value={formData.board} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">International Baccalaureate</option>
                  <option value="Cambridge">Cambridge</option>
                </select>
              </div>
              <div>
                <label className="block text_sm font-medium text-gray-700 mb-2">Affiliation Code (Optional)</label>
                <input type="text" name="affiliation" value={formData.affiliation} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., CBSE/2024/123456" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University/Affiliation</label>
              <input type="text" name="university" value={formData.university} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., University of Delhi" required />
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify_end">
            <button type="submit" disabled={isSubmitting} className={`px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg'}`}>
              {isSubmitting ? 'Registering...' : 'Register Institution'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Registered Institutions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockInstitutions.map(institution => (
            <div key={institution.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{institution.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{institution.location}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="capitalize">{institution.type}</span>
                    <span>•</span>
                    <span>Code: <strong>{institution.institutionCode}</strong></span>
                    <span>•</span>
                    <span>Created: {new Date(institution.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${institution.type === 'school' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {institution.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstitutionRegistration;

