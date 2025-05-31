// Update the Template interface to match the API response
export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  html_structure: string;
  css_styles: string;
  is_premium: boolean;
  is_featured: boolean;
  usage_count: number;
  avg_ats_score: number;
  created_at: string;
  tags: string[];
}

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

// Add LoginResponse interface
export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}