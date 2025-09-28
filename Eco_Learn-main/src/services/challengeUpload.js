// Service for uploading challenge proof images
// Uses Vercel API routes in production, local development server otherwise

const API_BASE = import.meta.env.VITE_API_BASE || (
  import.meta.env.PROD ? '/api' : 'http://localhost:8000'
);

export async function uploadChallengeProof({ studentId, challengeId, file }) {
  const formData = new FormData();
  formData.append('student_id', studentId);
  formData.append('challenge_id', challengeId);
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/upload-challenge-proof`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Upload failed' };
    }
    return { success: true, record: data.record };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function listStudentImages(studentId) {
  try {
    const res = await fetch(`${API_BASE}/student/${studentId}/images`);
    const data = await res.json();
    return data.images || [];
  } catch (e) {
    return [];
  }
}
