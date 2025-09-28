import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Users, CheckCircle, UploadCloud, XCircle, Image as ImageIcon } from 'lucide-react';
import { uploadChallengeProof, listStudentImages } from '../../services/challengeUpload.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ChallengeCard = ({ challenge, onStartChallenge }) => {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submissions, setSubmissions] = useState([]); // local preview submissions
  const fileInputRef = useRef(null);

  // Load stored submissions from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    const key = `challenge_submissions_${user.id}_${challenge.id}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSubmissions(parsed);
      }
    } catch (e) { /* ignore */ }
    // Hydrate from backend (optional) if local empty or to merge
    (async () => {
      const backendImages = await listStudentImages(user.id);
      const challengeImages = backendImages.filter(img => img.challenge_id === String(challenge.id));
      if (challengeImages.length) {
        // Merge avoiding duplicates by filename
        const existingNames = new Set((submissions || []).map(s => s.filename));
        const merged = [
          ...challengeImages.filter(ci => !existingNames.has(ci.filename)).map(ci => ({
            ...ci,
            previewUrl: (import.meta.env.VITE_API_BASE || 'http://localhost:8000') + ci.url
          })),
          ...(submissions || [])
        ];
        setSubmissions(merged);
        persistSubmissions(merged);
      }
    })();
  }, [user?.id, challenge.id]);

  const persistSubmissions = (data) => {
    if (!user?.id) return;
    const key = `challenge_submissions_${user.id}_${challenge.id}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'mission': return '🎯';
      case 'project': return '📋';
      case 'quiz': return '❓';
      case 'habit': return '🔄';
      default: return '⭐';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setError(null); setSuccess(null);
    setUploading(true);
    const result = await uploadChallengeProof({ studentId: user.id, challengeId: challenge.id, file });
    setUploading(false);
    if (!result.success) {
      setError(result.error || 'Upload failed');
      // reset file input so same file can be picked again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
    const servedUrl = result.record?.url ? apiBase + result.record.url : objectUrl;
    const newEntry = { ...result.record, previewUrl: servedUrl };
    const next = [newEntry, ...submissions];
    setSubmissions(next);
    persistSubmissions(next);
    setSuccess('Image uploaded successfully');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{challenge.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {getTypeIcon(challenge.type)} {challenge.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-yellow-600">
              <Award className="h-4 w-4" />
              <span className="font-semibold">{challenge.points} pts</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-2 line-clamp-2">{challenge.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{challenge.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{challenge.gradeLevels.join(', ')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>{String(challenge.validation).replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="text-sm text-gray-500">
            Category: <span className="font-medium text-gray-700">{challenge.category}</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onStartChallenge?.(challenge.id)}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              Start
            </motion.button>
            {user?.id && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowUpload(s => !s)}
                className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm flex items-center gap-1"
              >
                <UploadCloud className="h-4 w-4" /> Proof
              </motion.button>
            )}
          </div>
        </div>

        {showUpload && (
          <div className="border border-dashed border-indigo-300 rounded-lg p-4 bg-indigo-50/40 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-indigo-700 flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Upload Challenge Proof</p>
              <button className="text-indigo-500 text-xs" onClick={() => setShowUpload(false)}>Close</button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
            {uploading && <p className="text-xs text-indigo-600 animate-pulse">Uploading...</p>}
            {error && (
              <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2">
                <XCircle className="h-4 w-4 mt-px" />
                <span>{error === 'Duplicate image detected' ? 'This image is a duplicate of one you already uploaded. Please upload a different proof.' : error}</span>
              </div>
            )}
            {success && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">{success}</div>
            )}
          </div>
        )}

        {submissions.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2">Your Submissions ({submissions.length})</p>
            <div className="grid grid-cols-4 gap-2">
              {submissions.map((s, i) => (
                <div key={i} className="relative group">
                  <img src={s.previewUrl} alt="submission" className="h-20 w-full object-cover rounded" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white transition-opacity rounded p-1 text-center leading-tight">
                    {s.uploaded_at}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChallengeCard;

