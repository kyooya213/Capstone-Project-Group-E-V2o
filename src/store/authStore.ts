import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient'
import type { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => Promise<boolean>;
  logout: () => Promise<void>;
  getSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      getSession: async () => {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session fetch error:', sessionError.message);
            set({ user: null, isAuthenticated: false });
            return;
          }
          
          if (!session?.user) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('User data fetch error:', userError.message);
            set({ user: null, isAuthenticated: false });
            return;
          }

          if (userData) {
            set({ user: userData, isAuthenticated: true });
          }
        } catch (err) {
          console.error('Session fetch failed:', err);
          set({ user: null, isAuthenticated: false });
        }
      },

      login: async (email, password) => {
        try {
          console.log('Attempting login for:', email);
          
          const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });

          if (signInError) {
            console.error('Sign in error:', signInError.message);
            return false;
          }

          if (!authData?.session?.user) {
            console.error('No user data in auth response');
            return false;
          }

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.session.user.id)
            .single();

          if (userError) {
            console.error('User profile fetch error:', userError.message);
            return false;
          }

          if (!userData) {
            console.error('User profile not found');
            return false;
          }

          set({ user: userData, isAuthenticated: true });
          console.log('Login successful for:', email);
          return true;

        } catch (err) {
          console.error('Login failed:', err);
          return false;
        }
      },

      register: async (email, password, userData) => {
        try {
          console.log('Attempting registration for:', email);
          
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: {
                name: userData.name,
                role: 'customer'
              }
            }
          });

          if (signUpError) {
            console.error('Sign up error:', signUpError.message);
            return false;
          }
          
          if (!authData.user) {
            console.error('No user data returned from sign up');
            return false;
          }

          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: authData.user.email!,
                name: userData.name,
                role: 'customer',
                phone: userData.phone || null,
                address: userData.address || null
              }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('User profile creation error:', insertError.message);
            // Attempt to clean up the auth user if profile creation fails
            try {
              await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (cleanupError) {
              console.error('Failed to clean up auth user:', cleanupError);
            }
            return false;
          }

          if (authData.session) {
            set({
              user: {
                id: authData.user.id,
                email: authData.user.email!,
                name: userData.name,
                role: 'customer',
                phone: userData.phone || null,
                address: userData.address || null,
                created_at: new Date().toISOString()
              },
              isAuthenticated: true
            });
            console.log('Registration successful for:', email);
          }

          return true;
        } catch (err) {
          console.error('Registration failed:', err);
          return false;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Sign out error:', error.message);
            throw error;
          }
          set({ user: null, isAuthenticated: false });
          console.log('Logout successful');
        } catch (err) {
          console.error('Logout failed:', err);
          throw err;
        }
      },
    }),
    { 
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);