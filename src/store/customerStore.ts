import { create } from 'zustand';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

interface CustomerStore {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  isLoading: false,
  error: null,
  fetchCustomers: () => {
    set({ isLoading: true, error: null });

    // Simulate fetch delay
    setTimeout(() => {
      set({
        customers: [
          {
            id: 'cust-001',
            name: 'Juan Dela Cruz',
            email: 'juan@example.com',
            phone: '09171234567',
            address: 'Manila, Philippines',
            created_at: '2024-06-01T12:00:00Z',
          },
          {
            id: 'cust-002',
            name: 'Maria Santos',
            email: 'maria@example.com',
            phone: '09281234567',
            address: 'Cebu City, Philippines',
            created_at: '2024-05-20T08:30:00Z',
          },
          {
            id: 'cust-003',
            name: 'Pedro Ramirez',
            email: 'pedro@example.com',
            phone: '09391234567',
            address: 'Davao City, Philippines',
            created_at: '2024-05-15T15:45:00Z',
          },
        ],
        isLoading: false,
      });
    }, 1000);
  },
}));
