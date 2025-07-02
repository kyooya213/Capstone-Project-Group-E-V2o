import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { ExtendedOrder } from '../../models/Order';

export const MyOrders: React.FC = () => {
  const { orders, fetchOrders } = useOrderStore() as unknown as { orders: ExtendedOrder[]; fetchOrders: () => void };
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null); // Add type for selectedOrder
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSelectOrder = (order: ExtendedOrder) => { // Add type for order
    setSelectedOrder(order);
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    setStatus('Saving...');
    const { error } = await supabase
      .from('orders')
      .update({
        size: selectedOrder.size,
        quantity: selectedOrder.quantity,
        material: selectedOrder.material,
        totalPrice: selectedOrder.totalPrice,
        isPaid: selectedOrder.isPaid,
      })
      .eq('id', selectedOrder.id);

    if (error) {
      console.error('Save failed:', error);
      setStatus('Failed to save order. See console for error.');
    } else {
      setStatus('Order saved successfully!');
      fetchOrders(); // Refresh orders after saving
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <p className="text-sm text-gray-600">{status}</p>

      {selectedOrder ? (
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold">Edit Order #{selectedOrder.orderNumber}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <Input
                value={selectedOrder.size || ''}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, size: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <Input
                type="number"
                value={selectedOrder.quantity || 0}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, quantity: parseInt(e.target.value, 10) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <Input
                value={selectedOrder.material || ''}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, material: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Price</label>
              <Input
                type="number"
                value={selectedOrder.totalPrice || 0}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, totalPrice: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                aria-label="Payment Status" // Add accessible name
                value={selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, isPaid: e.target.value === 'Paid' })}
                className="block w-full p-2 border rounded-md"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <Button onClick={handleSaveOrder}>Save Order</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.orderNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Size: {order.size || '0m x 0m'}</p>
                <p>Material: {order.material || 'No material specified'}</p>
                <p>Total: ₱{order.totalPrice.toLocaleString()}</p>
                <p>Payment: {order.isPaid ? 'Paid' : 'Unpaid'}</p>
                <Button onClick={() => handleSelectOrder(order)}>Edit Order</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};