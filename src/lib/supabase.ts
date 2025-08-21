
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your own Supabase project URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required. Please check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
