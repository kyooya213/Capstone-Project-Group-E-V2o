import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { OrderCard } from '../../components/order/OrderCard';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { customerOrders } = useOrderStore();
  
  // Get the customer's orders if they exist
  const orders = user ? customerOrders(user.id) : [];
  
  // Get the 3 most recent orders
  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  // Count orders by status
  const pendingOrders = orders.filter(order => order.status?.name === 'pending').length;
  const processingOrders = orders.filter(order => order.status?.name === 'processing').length;
  const completedOrders = orders.filter(order => order.status?.name === 'completed').length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <Link to="/dashboard/new-order">
          <Button leftIcon={<Plus size={18} />}>
            New Order
          </Button>
        </Link>
      </div>
      
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{orders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending/Processing</p>
                <h3 className="text-3xl font-bold text-gray-900">{pendingOrders + processingOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{completedOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm font-medium text-blue-700 hover:text-blue-900">
            View All Orders
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't placed any orders yet. Start by creating your first order.
                </p>
                <Link to="/dashboard/new-order">
                  <Button leftIcon={<Plus size={18} />}>
                    Create New Order
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/new-order" className="flex items-center p-4 border rounded-md hover:bg-gray-50">
              <Plus className="h-5 w-5 text-blue-700 mr-3" />
              <span className="text-gray-900 font-medium">New Order</span>
            </Link>
            
            <Link to="/dashboard/orders" className="flex items-center p-4 border rounded-md hover:bg-gray-50">
              <FileText className="h-5 w-5 text-blue-700 mr-3" />
              <span className="text-gray-900 font-medium">My Orders</span>
            </Link>
            
            <Link to="/dashboard/profile" className="flex items-center p-4 border rounded-md hover:bg-gray-50">
              <AlertCircle className="h-5 w-5 text-blue-700 mr-3" />
              <span className="text-gray-900 font-medium">Account Settings</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};