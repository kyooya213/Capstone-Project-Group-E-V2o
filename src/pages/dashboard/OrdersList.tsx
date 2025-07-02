import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select, SelectOption } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { OrderCard } from '../../components/order/OrderCard';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { statuses } from '../../lib/data';

export const OrdersList: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, customerOrders } = useOrderStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';
  const isCustomer = user?.role === 'customer';
  
  // Get either all orders (for admin) or just the customer's orders
  const allOrders = isCustomer && user
    ? customerOrders(user.id)
    : orders;
  
  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Statuses' },
    ...statuses.map(status => ({
      value: status.id,
      label: status.name.charAt(0).toUpperCase() + status.name.slice(1),
    }))
  ];
  
  const sortOptions: SelectOption[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
  ];
  
  // Filter and sort orders
  const filteredOrders = allOrders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !statusFilter || order.statusId === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.totalPrice - a.totalPrice;
        case 'price-low':
          return a.totalPrice - b.totalPrice;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'All Orders' : 'My Orders'}
        </h1>
        
        {isCustomer && (
          <Link to="/dashboard/new-order">
            <Button leftIcon={<Plus size={18} />}>
              New Order
            </Button>
          </Link>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by order number or customer"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>
            
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              fullWidth
            />
            
            <Select
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
              placeholder="Sort by"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>
      
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              showCustomer={isAdmin}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'There are no orders to display.'}
              </p>
              
              {isCustomer && (
                <Link to="/dashboard/new-order">
                  <Button leftIcon={<Plus size={18} />}>
                    Create New Order
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};