import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This will help us see if the variables are actually loading in the browser
if (typeof window !== 'undefined') {
  console.log("Supabase Client Initializing...");
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase variables are missing in the browser!");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)