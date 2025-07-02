import React, { useEffect, useState } from 'react';
import { useCustomerStore } from '../../store/customerStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

// Demo customer orders (replace with real API later)
const demoOrders: Record<string, { id: string; title: string; status: string; total: number }[]> = {
  'cust-001': [
    { id: 'ord-101', title: 'Birthday Banner', status: 'Completed', total: 500 },
    { id: 'ord-102', title: 'Wedding Backdrop', status: 'Processing', total: 1200 },
  ],
  'cust-002': [{ id: 'ord-103', title: 'Business Signage', status: 'Pending', total: 800 }],
  'cust-003': [],
};

export const Customers: React.FC = () => {
  const { customers, fetchCustomers, isLoading, error } = useCustomerStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((c) =>
    `${c.name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Input
          placeholder="Search by name or email"
          className="w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const orders = demoOrders[customer.id] || [];

            return (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {customer.email}</p>
                  <p>Phone: {customer.phone}</p>
                  <p>Address: {customer.address}</p>
                  <p>Joined: {new Date(customer.created_at).toLocaleDateString()}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-1">Orders:</h4>
                    {orders.length > 0 ? (
                      <ul className="text-sm space-y-2">
                        {orders.map((order) => (
                          <li key={order.id} className="border rounded p-2">
                            <p className="font-medium">{order.title}</p>
                            <p>Status: {order.status}</p>
                            <p>Total: ₱{order.total.toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No orders yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
};
