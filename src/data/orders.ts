import type { OrderStatus } from '../models/Order';

// Define LocalOrder (frontend-friendly camelCase version of Order)
export interface ExtendedOrder extends LocalOrder {
  file_name?: string;
  quantity?: number;
  height?: number;
  width?: number;
  statusId?: string;
  paymentMethods?: string[];
  paymentStatus?: string;
  orderStatus?: string;
}

export interface LocalOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  materialId: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  paymentMethod: string;
  paymentReference: string;
  notes: string;
  billingAddress?: string;
  shippingAddress?: string;
  items?: any[];
  discounts?: any[];
  taxes?: any[];
}

// Function that creates a LocalOrder
export function createOrder(
  id: string,
  orderNumber: string,
  customerId: string,
  materialId: string,
  status: OrderStatus,
  totalPrice: number,
  createdAt: string,
  updatedAt: string,
  isPaid: boolean,
  paymentMethod: string,
  paymentReference: string = '',
  notes: string = '',
  billingAddress?: string,
  shippingAddress?: string,
  items?: any[],
  discounts?: any[],
  taxes?: any[]
): LocalOrder {
  return {
    id,
    orderNumber,
    customerId,
    materialId,
    status,
    totalPrice,
    createdAt,
    updatedAt,
    isPaid,
    paymentMethod,
    paymentReference,
    notes,
    billingAddress,
    shippingAddress,
    items,
    discounts,
    taxes,
  };
}

// Sample realistic orders
export const orders: LocalOrder[] = [
  createOrder(
    'ord-001',
    'ORD-20250601-001',
    'john.doe@example.com',
    'tarpaulin-glossy-10x15',
    'pending',
    1200.00,
    '2025-06-01T10:00:00Z',
    '2025-06-01T10:00:00Z',
    false,
    'gcash',
    '',
    'Rush order for school event',
    '123 Elm Street, Makati, Metro Manila, PH',
    '123 Elm Street, Makati, Metro Manila, PH',
    [
      { name: 'Event Banner', dimensions: '10x15 ft', material: 'Glossy Tarpaulin' }
    ]
  ),
  createOrder(
    'ord-002',
    'ORD-20250602-002',
    'mary.ann@example.com',
    'tarpaulin-matte-5x10',
    'processing',
    800.00,
    '2025-06-02T11:00:00Z',
    '2025-06-02T12:00:00Z',
    true,
    'paypal',
    'PAYPAL-TXN-7823',
    'Include grommets every 2 ft',
    '456 Pine Street, Cebu City, PH',
    '789 Mango Ave, Cebu City, PH',
    [
      { name: 'Store Promo Banner', dimensions: '5x10 ft', material: 'Matte Tarpaulin' }
    ]
  ),
  createOrder(
    'ord-003',
    'ORD-20250603-003',
    'robert.santos@example.com',
    'tarpaulin-mesh-6x8',
    'completed',
    960.00,
    '2025-06-03T09:00:00Z',
    '2025-06-03T10:00:00Z',
    true,
    'bank_transfer',
    'BT-REF-2025-003',
    'Delivered and received by client',
    '101 Coconut Lane, Davao City, PH',
    '101 Coconut Lane, Davao City, PH',
    [
      { name: 'Outdoor Banner', dimensions: '6x8 ft', material: 'Mesh Tarpaulin' }
    ]
  ),
  createOrder(
    'ord-004',
    'ORD-20250604-004',
    'liza.reyes@example.com',
    'tarpaulin-glossy-3x5',
    'completed',
    300.00,
    '2025-06-04T09:00:00Z',
    '2025-06-04T10:00:00Z',
    true,
    'cod',
    'COD-DEL-20250604',
    'Birthday banner design included',
    '900 Rose Street, Taguig, Metro Manila, PH',
    '900 Rose Street, Taguig, Metro Manila, PH',
    [
      { name: 'Birthday Banner', dimensions: '3x5 ft', material: 'Glossy Tarpaulin' }
    ]
  )
];

// Original Order type (for backend or database schema use)
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  materialId: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  payment_method: string;
  payment_reference: string;
  notes: string;
  billing_address?: string;
  shipping_address?: string;
  items?: any[];
  discounts?: any[];
  taxes?: any[];
}
