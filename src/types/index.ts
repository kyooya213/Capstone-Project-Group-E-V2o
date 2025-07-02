export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface OrderStatus {
  id: string;
  name: 'pending' | 'processing' | 'printed' | 'completed' | 'cancelled';
  color: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  pricePerSqm: number;
  available: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: User;
  orderNumber: string;
  width: number; // in meters
  height: number; // in meters
  quantity: number;
  materialId: string;
  material?: Material;
  designNotes?: string;
  fileUrl?: string;
  fileName?: string;
  statusId: string;
  status?: OrderStatus;
  totalPrice: number;
  isPaid: boolean;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobUpdate {
  id: string;
  orderId: string;
  statusId: string;
  status?: OrderStatus;
  note?: string;
  createdBy: string;
  createdByUser?: User;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  sender?: User;
  content: string;
  createdAt: Date;
}