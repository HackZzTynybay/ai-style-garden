import { toast } from "@/hooks/use-toast";
import { getCookie } from "./cookies";

const API_URL = 'https://ai-style-garden.onrender.com/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

/**
 * Utility function for making API requests
 */
export const fetchApi = async <T>(
  endpoint: string, 
  options: FetchOptions = { method: 'GET', requiresAuth: false }
): Promise<T> => {
  const { method, body, requiresAuth = false } = options;
  
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add authorization header if token exists and request requires auth
  if (requiresAuth) {
    const token = getCookie('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data as T;
  } catch (error: any) {
    console.error('API request failed:', error);
    toast({
      title: 'Request Failed',
      description: error.message || 'An error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};

// Response type definitions
export interface AuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  email?: string;
  message?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// API endpoints abstractions
export const authApi = {
  register: (userData: any) => 
    fetchApi<AuthResponse>('/auth/register', { method: 'POST', body: userData }),
  
  login: (credentials: { email: string; password: string }) => 
    fetchApi<AuthResponse>('/auth/login', { method: 'POST', body: credentials }),
  
  logout: () => 
    fetchApi<AuthResponse>('/auth/logout', { method: 'GET' }),
  
  verifyEmail: (token: string) => 
    fetchApi<AuthResponse>(`/auth/verify-email/${token}`, { method: 'GET' }),
  
  createPassword: (data: { userId: string; password: string }) => 
    fetchApi<AuthResponse>('/auth/create-password', { method: 'PUT', body: data }),
  
  resendVerification: (email: string) => 
    fetchApi<AuthResponse>('/auth/resend-verification', { method: 'POST', body: { email } }),
  
  updateEmail: (data: { userId: string; email: string }) => 
    fetchApi<AuthResponse>('/auth/update-email', { method: 'PUT', body: data }),
};

export interface UserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    company?: {
      name: string;
      companyId: string;
      employeesCount: number;
    };
  };
  message?: string;
}

export const userApi = {
  getCurrentUser: () => 
    fetchApi<UserResponse>('/users/me', { 
      method: 'GET',
      requiresAuth: true 
    }),
  
  updateUser: (userData: any) => 
    fetchApi<UserResponse>('/users/me', { 
      method: 'PUT', 
      body: userData,
      requiresAuth: true 
    }),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) => 
    fetchApi<AuthResponse>('/users/password', { 
      method: 'PUT', 
      body: data,
      requiresAuth: true 
    }),
};

export interface CompanyResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    industry: string;
    size: string;
    location: string;
  };
  message?: string;
}

export const companyApi = {
  getCompany: (id: string) => 
    fetchApi<CompanyResponse>(`/companies/${id}`, { method: 'GET' }),
  
  updateCompany: (id: string, companyData: any) => 
    fetchApi<CompanyResponse>(`/companies/${id}`, { method: 'PUT', body: companyData }),
};
