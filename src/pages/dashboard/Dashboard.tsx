import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { CustomerDashboard } from './CustomerDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  // Render the appropriate dashboard based on user role
  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }
  
  return <AdminDashboard />;
};