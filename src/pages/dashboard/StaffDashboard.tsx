import React from 'react';

interface StaffDashboardProps {
  staffId: string;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ staffId }) => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
      <p className="text-gray-700">Welcome staff member. Your ID is: <strong>{staffId}</strong></p>
      
      {/* Add staff-specific content here */}
    </div>
  );
};
