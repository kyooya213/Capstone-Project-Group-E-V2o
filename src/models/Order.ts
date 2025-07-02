export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Base Order type (from backend or database, snake_case)
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  materialId: string;
  status: OrderStatus;
  totalPrice: number;         // preferred camelCase
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

// LocalOrder used in frontend (camelCase and frontend-prepped)
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

// Extended version used in Zustand/local UI logic
export interface ExtendedOrder extends LocalOrder {
  file_name: any;
  size: string;
  material: string;
  fileName?: string;
  quantity?: number;
  height?: number;
  width?: number;
  statusId?: string;
  paymentMethods?: string[];
  paymentStatus?: string;
  orderStatus?: string;
}
