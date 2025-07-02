import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag,
  Users,
  AlertCircle, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { OrderCard } from '../../components/order/OrderCard';
import { useOrderStore } from '../../store/orderStore';
import { statuses, users } from '../../lib/data';

export const AdminDashboard: React.FC = () => {
  const { orders } = useOrderStore();
  
  // Get the 6 most recent orders
  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);
  
  // Count orders by status
  const pendingOrders = orders.filter(order => order.status?.name === 'pending').length;
  const processingOrders = orders.filter(order => order.status?.name === 'processing').length;
  const printedOrders = orders.filter(order => order.status?.name === 'printed').length;
  const completedOrders = orders.filter(order => order.status?.name === 'completed').length;
  const cancelledOrders = orders.filter(order => order.status?.name === 'cancelled').length;
  
  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Count paid/unpaid orders
  const paidOrders = orders.filter(order => order.isPaid).length;
  const unpaidOrders = orders.filter(order => !order.isPaid).length;
  
  // Count customers (excluding admin/staff)
  const customerCount = users.filter(user => user.role === 'customer').length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/dashboard/reports">
            <Button variant="outline" leftIcon={<TrendingUp size={18} />}>
              View Reports
            </Button>
          </Link>
          <Link to="/dashboard/orders">
            <Button leftIcon={<ShoppingBag size={18} />}>
              Manage Orders
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
                <ShoppingBag size={24} />
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
              <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-3xl font-bold text-gray-900">₱{totalSales.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-700 mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <h3 className="text-3xl font-bold text-gray-900">{customerCount}</h3>
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
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{pendingOrders}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Badge variant="warning" className="mb-2">Pending</Badge>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Badge variant="primary" className="mb-2">Processing</Badge>
              <p className="text-2xl font-bold text-gray-900">{processingOrders}</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Badge variant="secondary" className="mb-2">Printed</Badge>
              <p className="text-2xl font-bold text-gray-900">{printedOrders}</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Badge variant="success" className="mb-2">Completed</Badge>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-md">
              <Badge variant="danger" className="mb-2">Cancelled</Badge>
              <p className="text-2xl font-bold text-gray-900">{cancelledOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-4 border rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Paid Orders</p>
                  <p className="text-xl font-bold text-gray-900">{paidOrders}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border rounded-md">
                <XCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Unpaid Orders</p>
                  <p className="text-xl font-bold text-gray-900">{unpaidOrders}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/dashboard/orders?status=pending">
                <Button variant="outline" fullWidth leftIcon={<Clock size={18} />}>
                  View Pending Orders
                </Button>
              </Link>
              
              <Link to="/dashboard/orders?paid=false">
                <Button variant="outline" fullWidth leftIcon={<AlertCircle size={18} />}>
                  View Unpaid Orders
                </Button>
              </Link>
              
              <Link to="/dashboard/customers">
                <Button variant="outline" fullWidth leftIcon={<Users size={18} />}>
                  Manage Customers
                </Button>
              </Link>
              
              <Link to="/dashboard/settings">
                <Button variant="outline" fullWidth>
                  System Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/dashboard/orders" className="text-sm font-medium text-blue-700 hover:text-blue-900">
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order} showCustomer />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};