import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { phpApi, type User } from '../lib/phpApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  getSession: () => Promise<void>;
}

export const usePhpAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      getSession: async () => {
        try {
          if (!phpApi.isAuthenticated()) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const response = await phpApi.getSession();
          
          if (response.success && response.user) {
            set({ user: response.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Session fetch failed:', error);
          set({ user: null, isAuthenticated: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          console.log('Attempting login for:', email);
          
          const response = await phpApi.login(email, password);
          
          if (response.success && response.user) {
            set({ user: response.user, isAuthenticated: true });
            console.log('Login successful for:', email);
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      register: async (userData) => {
        try {
          console.log('Attempting registration for:', userData.email);
          
          const response = await phpApi.register(userData);
          
          if (response.success && response.user) {
            set({ user: response.user, isAuthenticated: true });
            console.log('Registration successful for:', userData.email);
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          await phpApi.logout();
          set({ user: null, isAuthenticated: false });
          console.log('Logout successful');
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if server request fails
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    { 
      name: 'php-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);