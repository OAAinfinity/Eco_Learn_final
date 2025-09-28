import { supabase, isSupabaseEnabled } from '../lib/supabase.js';
import { mockChallenges } from '../data/mockData.js';

export async function listChallenges() {
  if (!isSupabaseEnabled || !supabase) {
    return mockChallenges;
  }

  const { data, error } = await supabase.from('challenges').select('*');
  if (error) {
    console.error('listChallenges error', error);
    return mockChallenges;
  }
  return data ?? [];
}

export async function startChallenge(userId, challengeId) {
  if (!isSupabaseEnabled || !supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from('challenge_progress').insert({
    user_id: userId,
    challenge_id: challengeId,
    status: 'started'
  });
  if (error) {
    console.error('startChallenge error', error);
    return { ok: false, error };
  }
  return { ok: true };
}

