import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Check your .env file and restart the dev server.');
}

// Create the Supabase client with additional options for better reliability
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js@2.x',
    },
  },
  db: {
    schema: 'public'
  }
});

// Test the connection and log the result
export const testConnection = async () => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    console.log('Connected to:', supabaseUrl);
    console.log('Database accessible, users table exists');
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('Failed connecting to:', supabaseUrl);
    console.error('Please check:');
    console.error('1. Supabase project is running and accessible');
    console.error('2. Environment variables are correct');
    console.error('3. Database schema and tables exist');
    console.error('4. RLS policies are configured correctly');
  }
};

// Commenting out automatic connection test during development
// testConnection();