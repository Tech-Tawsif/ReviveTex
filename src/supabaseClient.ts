/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your project's URL and Anon Key from your Supabase dashboard.
import { createMockSupabase } from './supabaseMock';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY  || '';

let supabase: any = null;
let initError: string | null = null;
let isDemoMode = false;

console.log("Supabase Client Initializing...");
if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http') || !supabaseAnonKey.startsWith('ey')) {
  console.warn("Supabase credentials missing. Falling back to Demo Mode.");
  isDemoMode = true;
  supabase = createMockSupabase();
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase Client Created Successfully");
  } catch (e) {
    console.error("Supabase client initialization failed:", e);
    initError = e instanceof Error ? e.message : String(e);
  }
}

export { supabase, initError, isDemoMode };
