import { Material, OrderStatus, User, Order } from '../types';
import { generateOrderNumber } from './utils';

export const statuses: OrderStatus[] = [
  { id: '1', name: 'pending', color: 'bg-yellow-500' },
  { id: '2', name: 'processing', color: 'bg-blue-500' },
  { id: '3', name: 'printed', color: 'bg-purple-500' },
  { id: '4', name: 'completed', color: 'bg-green-500' },
  { id: '5', name: 'cancelled', color: 'bg-red-500' }
];

export const materials: Material[] = [
  {
    id: '1',
    name: 'Standard Vinyl',
    description: 'Economical option for short-term indoor/outdoor use',
    pricePerSqm: 180,
    available: true
  },
  {
    id: '2',
    name: 'Heavy Duty Vinyl',
    description: 'Durable material for long-term outdoor display',
    pricePerSqm: 250,
    available: true
  },
  {
    id: '3',
    name: 'Mesh Vinyl',
    description: 'Perforated material ideal for windy locations',
    pricePerSqm: 280,
    available: true
  },
  {
    id: '4',
    name: 'Backlit Film',
    description: 'Translucent material designed for illuminated displays',
    pricePerSqm: 350,
    available: true
  }
];

export const users: User[] = [
  {
    id: '1',
    email: 'admin@tarpaulin.com',
    name: 'Admin User',
    role: 'admin',
    phone: '09123456789',
    address: 'Manila, Philippines',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    email: 'staff@tarpaulin.com',
    name: 'Staff User',
    role: 'staff',
    phone: '09123456788',
    address: 'Quezon City, Philippines',
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    email: 'customer@example.com',
    name: 'Sample Customer',
    role: 'customer',
    phone: '09987654321',
    address: 'Makati City, Philippines',
    createdAt: new Date('2023-01-03')
  }
];

export const orders: Order[] = [
  {
    id: '1',
    customerId: '3',
    customer: users.find(u => u.id === '3'),
    orderNumber: generateOrderNumber(),
    width: 3,
    height: 2,
    quantity: 1,
    materialId: '1',
    material: materials.find(m => m.id === '1'),
    designNotes: 'Please make the text larger and more visible from a distance.',
    fileUrl: 'https://example.com/files/sample-design.jpg',
    fileName: 'sample-design.jpg',
    statusId: '1',
    status: statuses.find(s => s.id === '1'),
    totalPrice: 1080, // 3m × 2m × 1 × ₱180
    isPaid: false,
    createdAt: new Date('2023-04-15T10:30:00'),
    updatedAt: new Date('2023-04-15T10:30:00')
  },
  {
    id: '2',
    customerId: '3',
    customer: users.find(u => u.id === '3'),
    orderNumber: generateOrderNumber(),
    width: 5,
    height: 1,
    quantity: 2,
    materialId: '2',
    material: materials.find(m => m.id === '2'),
    designNotes: 'Use vibrant colors for outdoor visibility.',
    fileUrl: 'https://example.com/files/outdoor-banner.pdf',
    fileName: 'outdoor-banner.pdf',
    statusId: '2',
    status: statuses.find(s => s.id === '2'),
    totalPrice: 2500, // 5m × 1m × 2 × ₱250
    isPaid: true,
    paymentMethod: 'GCash',
    paymentReference: 'GC123456789',
    createdAt: new Date('2023-04-10T14:15:00'),
    updatedAt: new Date('2023-04-12T09:45:00')
  },
  {
    id: '3',
    customerId: '3',
    customer: users.find(u => u.id === '3'),
    orderNumber: generateOrderNumber(),
    width: 2,
    height: 1.5,
    quantity: 3,
    materialId: '3',
    material: materials.find(m => m.id === '3'),
    designNotes: 'For a store front with frequent wind exposure.',
    fileUrl: 'https://example.com/files/storefront-mesh.jpg',
    fileName: 'storefront-mesh.jpg',
    statusId: '3',
    status: statuses.find(s => s.id === '3'),
    totalPrice: 2520, // 2m × 1.5m × 3 × ₱280
    isPaid: true,
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT987654321',
    createdAt: new Date('2023-04-05T11:20:00'),
    updatedAt: new Date('2023-04-08T16:30:00')
  }
];