import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { generateOrderNumber } from '../lib/utils';

type Order = Database['public']['Tables']['orders']['Row'];
type NewOrder = Omit<Order, 'id' | 'created_at' | 'updated_at'>;

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  customerOrders: (customerId: string) => Order[];
  getOrder: (orderId: string) => Order | undefined;
  createOrder: (newOrder: Omit<NewOrder, 'order_number'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updatePaymentStatus: (
    orderId: string,
    isPaid: boolean,
    paymentMethod?: string,
    paymentReference?: string
  ) => Promise<void>;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users(*),
          material:materials(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },

  customerOrders: (customerId: string) => {
    return get().orders.filter(order => order.customer_id === customerId);
  },

  getOrder: (orderId: string) => {
    return get().orders.find(order => order.id === orderId);
  },

  createOrder: async (orderData) => {
    try {
      const orderNumber = generateOrderNumber();
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            ...orderData,
            order_number: orderNumber,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        orders: [data, ...state.orders],
      }));

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        ),
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  },

  updatePaymentStatus: async (
    orderId: string,
    isPaid: boolean,
    paymentMethod?: string,
    paymentReference?: string
  ) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          is_paid: isPaid,
          payment_method: paymentMethod,
          payment_reference: paymentReference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? {
                ...order,
                is_paid: isPaid,
                payment_method: paymentMethod,
                payment_reference: paymentReference,
                updated_at: new Date().toISOString(),
              }
            : order
        ),
      }));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  },
}));