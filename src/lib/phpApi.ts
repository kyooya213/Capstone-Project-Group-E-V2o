// PHP API client for authentication
const API_BASE_URL = 'http://localhost/php-backend/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
  address?: string;
  created_at: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  expires_at: string;
}

interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  action: string;
  table_name: string;
  record_id: number;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface ApiError {
  error: string;
}

class PhpApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async getSession(): Promise<{ success: boolean; user: User }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    return this.request<{ success: boolean; user: User }>('/auth/session.php');
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await this.request<{ success: boolean; message: string }>('/auth/logout.php', {
      method: 'POST',
    });

    if (response.success) {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    return response;
  }

  async uploadFile(file: File): Promise<{ success: boolean; file_url: string; file_name: string; message: string }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/file.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }

  async getAuditLogs(filters: {
    user_name?: string;
    action?: string;
    table_name?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<{ success: boolean; logs: AuditLog[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/audit/get_logs.php${queryString ? `?${queryString}` : ''}`;

    return this.request<{ success: boolean; logs: AuditLog[]; total: number }>(endpoint);
  }

  async createOrder(orderData: any): Promise<{ success: boolean; order: any; message: string }> {
    return this.request<{ success: boolean; order: any; message: string }>('/orders/create.php', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(orderId: number, updateData: any): Promise<{ success: boolean; order: any; message: string }> {
    return this.request<{ success: boolean; order: any; message: string }>('/orders/update.php', {
      method: 'PUT',
      body: JSON.stringify({ order_id: orderId, ...updateData }),
    });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const phpApi = new PhpApiClient();
export type { User, AuthResponse, AuditLog };