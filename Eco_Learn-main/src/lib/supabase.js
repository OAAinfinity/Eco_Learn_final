import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

let client = null;

if (isSupabaseEnabled) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true
    }
  });
}

export const supabase = client;

