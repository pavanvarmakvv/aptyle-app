import { createClient } from '@supabase/supabase-js'

// We use fallbacks to prevent "Exit Code 1" during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxiwyohzfvmmkdltpkfw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey && typeof window !== 'undefined') {
  console.warn("Supabase Anon Key is missing! Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)