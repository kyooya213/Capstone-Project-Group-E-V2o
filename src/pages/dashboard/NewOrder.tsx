import React from 'react';
import { EnhancedOrderForm } from '../../components/order/EnhancedOrderForm';

export const NewOrder: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
      <EnhancedOrderForm />
    </div>
  );
};