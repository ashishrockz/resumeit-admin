const API_BASE_URL = import.meta.env.VITE_API_URL;

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  date_joined: string;
  last_login: string | null;
  profile?: {
    subscription_type: string;
    resume_count: number;
    avg_ats_score: number;
  };
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  is_premium: boolean;
  is_featured: boolean;
  usage_count: number;
  avg_ats_score: number;
  created_at: string;
  tags: string[];
}

// API utility functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || error.detail || `HTTP ${response.status}`);
  }
  return response.json();
};

// Authentication API functions
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Template API functions
export const templateApi = {
  // ... rest of the template API functions
};

// User API functions
export const userApi = {
  // ... rest of the user API functions
};

// Subscription API functions
export const subscriptionApi = {
  // ... rest of the subscription API functions
};

// ATS API functions
export const atsApi = {
  // ... rest of the ATS API functions
};

// Analytics API functions
export const analyticsApi = {
  // ... rest of the analytics API functions
};