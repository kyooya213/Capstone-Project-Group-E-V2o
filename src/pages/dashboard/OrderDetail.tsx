import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Package, 
  CreditCard, 
  ArrowLeft, 
  Download, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectOption } from '../../components/ui/Select';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { statuses } from '../../lib/data';
import { formatCurrency, formatDateTime } from '../../lib/utils';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOrder, updateOrderStatus, updatePaymentStatus } = useOrderStore();
  
  const [message, setMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  
  const order = getOrder(orderId || '');
  
  if (!order) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/dashboard/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }
  
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';
  const isCustomer = user?.role === 'customer';
  const isCustomerOrder = isCustomer && order.customerId === user?.id;
  
  if (isCustomer && !isCustomerOrder) {
    navigate('/dashboard');
    return null;
  }
  
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
  
  const statusOptions: SelectOption[] = statuses.map(status => ({
    value: status.id,
    label: status.name.charAt(0).toUpperCase() + status.name.slice(1),
  }));
  
  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
  };
  
  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    
    setIsUpdatingStatus(true);
    
    updateOrderStatus(order.id, selectedStatus, statusNote);
    
    setTimeout(() => {
      setIsUpdatingStatus(false);
      setStatusNote('');
    }, 1000);
  };
  
  const handleUpdatePayment = (paid: boolean) => {
    setIsUpdatingPayment(true);
    
    updatePaymentStatus(
      order.id, 
      paid,
      paid ? 'Manual Confirmation' : undefined,
      paid ? `Confirmed by ${user?.name}` : undefined
    );
    
    setTimeout(() => {
      setIsUpdatingPayment(false);
    }, 1000);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the server
    alert(`Message sent: ${message}`);
    setMessage('');
  };
  
  const handleDownloadFile = () => {
    // In a real app, this would download the file from the server
    alert('Downloading file: ' + order.fileName);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/dashboard/orders')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        </div>
        <Badge variant={getStatusVariant(order.status?.name)} className="text-sm px-3 py-1">
          {order.status?.name?.charAt(0).toUpperCase() + order.status?.name?.slice(1)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">{order.width}m × {order.height}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium">{order.material?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-bold text-blue-700">{formatCurrency(order.totalPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                )}
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500">Design Notes</p>
                  <p className="font-medium">
                    {order.designNotes || 'No design notes provided.'}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-2">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.status?.name !== 'pending' && (
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Status Updated to {order.status?.name}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {order.isPaid && (
                    <div className="flex items-start">
                      <CreditCard className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Payment Received</p>
                        <p className="text-xs text-gray-500">
                          {order.paymentMethod && `via ${order.paymentMethod}`}
                          {order.paymentReference && ` (Ref: ${order.paymentReference})`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            {order.fileName && (
              <CardFooter className="border-t bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-5 w-5 mr-2" />
                    <span className="text-sm">{order.fileName}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={16} />}
                    onClick={handleDownloadFile}
                  >
                    Download File
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
          
          {/* Customer details for admin */}
          {isAdmin && order.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{order.customer.email}</p>
                  </div>
                  {order.customer.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{order.customer.phone}</p>
                    </div>
                  )}
                  {order.customer.address && (
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{order.customer.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">No messages yet.</p>
                </div>
                
                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mb-2"
                    fullWidth
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendMessage}
                      leftIcon={<MessageSquare size={18} />}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Admin Controls */}
          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select
                      label="New Status"
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      fullWidth
                    />
                    
                    <Textarea
                      label="Status Note (Optional)"
                      placeholder="Add a note about this status change..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      fullWidth
                    />
                    
                    <Button
                      onClick={handleUpdateStatus}
                      isLoading={isUpdatingStatus}
                      disabled={!selectedStatus || isUpdatingStatus}
                      fullWidth
                    >
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${order.isPaid ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className={`font-medium ${order.isPaid ? 'text-green-700' : 'text-red-700'}`}>
                        {order.isPaid ? 'This order has been paid' : 'This order is unpaid'}
                      </p>
                      {order.isPaid && order.paymentMethod && (
                        <p className="text-sm text-gray-600 mt-1">
                          Paid via {order.paymentMethod}
                          {order.paymentReference && ` (Ref: ${order.paymentReference})`}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant={order.isPaid ? 'danger' : 'primary'}
                      onClick={() => handleUpdatePayment(!order.isPaid)}
                      isLoading={isUpdatingPayment}
                      disabled={isUpdatingPayment}
                      fullWidth
                    >
                      {order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Customer Controls */}
          {isCustomer && (
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!order.isPaid && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-700 font-medium">This order requires payment</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Please complete payment to proceed with your order.
                      </p>
                    </div>
                  )}
                  
                  {!order.isPaid && (
                    <Button fullWidth>
                      Pay Now (₱{order.totalPrice.toFixed(2)})
                    </Button>
                  )}
                  
                  {order.status?.name === 'pending' && (
                    <Button variant="outline" fullWidth>
                      Cancel Order
                    </Button>
                  )}
                  
                  {order.fileName && (
                    <Button
                      variant="outline"
                      leftIcon={<Download size={18} />}
                      onClick={handleDownloadFile}
                      fullWidth
                    >
                      Download Design
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};