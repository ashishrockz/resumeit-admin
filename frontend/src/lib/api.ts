const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  profile?: {
    subscription_type: string;
    resume_count: number;
    avg_ats_score: number;
  };
}

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  html_structure: string;
  css_styles: string;
  is_premium: boolean;
  is_featured: boolean;
  usage_count: number;
  avg_ats_score: number;
  created_at: string;
  tags: string[];
}

export interface TemplateCategory {
  id: number;
  name: string;
  description: string;
  template_count: number;
}

export interface Subscription {
  id: number;
  user: number;
  plan: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
  is_active: boolean;
  subscriber_count: number;
}

export interface Transaction {
  id: number;
  subscription: number;
  amount: number;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface ATSScore {
  id: number;
  resume: number;
  score: number;
  job_title: string;
  suggestions: string[];
  keyword_matches: number;
  created_at: string;
}

export interface UserActivity {
  id: number;
  user: number;
  activity_type: string;
  description: string;
  created_at: string;
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
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// User API functions
export const userApi = {
  getUsers: async (params?: { page?: number; search?: string; status?: string; subscription?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params?.subscription && params.subscription !== 'all') searchParams.append('subscription', params.subscription);
    
    const response = await fetch(`${API_BASE_URL}/users/?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createUser: async (userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  },

  getUserActivities: async (userId?: number) => {
    const url = userId 
      ? `${API_BASE_URL}/users/${userId}/activities/`
      : `${API_BASE_URL}/users/activities/`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Template API functions
export const templateApi = {
  getTemplates: async (params?: { page?: number; search?: string; category?: string; premium?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.premium && params.premium !== 'all') searchParams.append('is_premium', params.premium === 'premium' ? 'true' : 'false');
    
    const response = await fetch(`${API_BASE_URL}/templates/?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTemplate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/templates/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createTemplate: async (templateData: Partial<Template>) => {
    const response = await fetch(`${API_BASE_URL}/templates/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(templateData),
    });
    return handleResponse(response);
  },

  updateTemplate: async (id: number, templateData: Partial<Template>) => {
    const response = await fetch(`${API_BASE_URL}/templates/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(templateData),
    });
    return handleResponse(response);
  },

  deleteTemplate: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/templates/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/templates/categories/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createCategory: async (categoryData: Partial<TemplateCategory>) => {
    const response = await fetch(`${API_BASE_URL}/templates/categories/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
  },
};

// Subscription API functions
export const subscriptionApi = {
  getSubscriptions: async (params?: { page?: number; status?: string; user?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params?.user) searchParams.append('user', params.user.toString());
    
    const response = await fetch(`${API_BASE_URL}/subscriptions/?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getSubscription: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createSubscription: async (subscriptionData: Partial<Subscription>) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subscriptionData),
    });
    return handleResponse(response);
  },

  updateSubscription: async (id: number, subscriptionData: Partial<Subscription>) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(subscriptionData),
    });
    return handleResponse(response);
  },

  cancelSubscription: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  renewSubscription: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}/renew/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/plans/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createPlan: async (planData: Partial<SubscriptionPlan>) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/plans/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleResponse(response);
  },

  updatePlan: async (id: number, planData: Partial<SubscriptionPlan>) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/plans/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleResponse(response);
  },

  getTransactions: async (params?: { page?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
    
    const response = await fetch(`${API_BASE_URL}/subscriptions/transactions/?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  processPayment: async (transactionId: number) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/transactions/${transactionId}/process_payment/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ATS API functions
export const atsApi = {
  getScores: async (params?: { page?: number; user?: number; job_title?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.user) searchParams.append('user', params.user.toString());
    if (params?.job_title) searchParams.append('job_title', params.job_title);
    
    const response = await fetch(`${API_BASE_URL}/ats/scores/?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getScore: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/ats/scores/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOptimizationSuggestions: async (scoreId: number) => {
    const response = await fetch(`${API_BASE_URL}/ats/scores/${scoreId}/optimization_suggestions/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getKeywordMatches: async (scoreId: number) => {
    const response = await fetch(`${API_BASE_URL}/ats/scores/${scoreId}/keyword_matches/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getJobTitleSynonyms: async () => {
    const response = await fetch(`${API_BASE_URL}/ats/job-title-synonyms/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Analytics API functions
export const analyticsApi = {
  getDashboardStats: async () => {
    // This would typically be a custom endpoint that aggregates data
    // For now, we'll fetch from multiple endpoints and combine
    const [users, subscriptions, atsScores] = await Promise.all([
      userApi.getUsers(),
      subscriptionApi.getSubscriptions(),
      atsApi.getScores(),
    ]);
    
    return {
      totalUsers: users.count || 0,
      totalSubscriptions: subscriptions.count || 0,
      avgAtsScore: atsScores.results?.length 
        ? atsScores.results.reduce((sum: number, score: ATSScore) => sum + score.score, 0) / atsScores.results.length 
        : 0,
      // Add more calculated stats as needed
    };
  },
};

// Authentication API functions
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
