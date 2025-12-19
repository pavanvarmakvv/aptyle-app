import { createClient } from '@supabase/supabase-js'

/**
 * COMPLETE SUPABASE CONFIGURATION
 * * 1. NEXT_PUBLIC_SUPABASE_URL: Your project URL from Supabase dashboard.
 * 2. NEXT_PUBLIC_SUPABASE_ANON_KEY: This should contain your 'sb_publishable_...' key.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxiwyohzfvmmkdltpkfw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// We create the client using these variables. 
// If the Key is missing, the console.error below will trigger in your browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- DEBUGGING (Browser Only) ---
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("FATAL ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from Environment Variables!");
  } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('eyJ')) {
    console.warn("WARNING: You are still using a Legacy JWT key. If you see 401 errors, swap this for the 'sb_publishable' key in Vercel.");
  }
}