import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface OrderCardProps {
  order: Order;
  showCustomer?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, showCustomer = false }) => {
  const getStatusVariant = (statusName?: string) => {
    switch (statusName) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'printed':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card hoverable className="transition-all duration-300 hover:translate-y-[-4px]">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">
              <Clock className="h-4 w-4 inline mr-1" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(order.status?.name)}>
            {order.status?.name?.charAt(0).toUpperCase() + order.status?.name?.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Size:</span>
            <span className="font-medium">{order.width}m × {order.height}m</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Quantity:</span>
            <span className="font-medium">{order.quantity}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Material:</span>
            <span className="font-medium">{order.material?.name}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total:</span>
            <span className="font-semibold text-blue-700">{formatCurrency(order.totalPrice)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment:</span>
            <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          
          {showCustomer && order.customer && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Customer:</span>
              <span className="font-medium">{order.customer.name}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center bg-gray-50">
        <div className="flex items-center text-gray-600">
          <FileText className="h-4 w-4 mr-1" />
          <span className="text-sm">{order.fileName || 'No file'}</span>
        </div>
        
        <Link to={`/dashboard/orders/${order.id}`} className="flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium">
          Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};