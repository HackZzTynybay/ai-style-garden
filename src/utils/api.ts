
import { toast } from "@/hooks/use-toast";

const API_URL = 'http://localhost:5000/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  withCredentials?: boolean;
}

/**
 * Utility function for making API requests
 */
export const fetchApi = async <T>(
  endpoint: string, 
  options: FetchOptions = { method: 'GET' }
): Promise<T> => {
  const { method, body, withCredentials = true } = options;
  
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const config: RequestInit = {
    method,
    headers,
    credentials: withCredentials ? 'include' : 'omit',
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

// API endpoints abstractions
export const authApi = {
  register: (userData: any) => 
    fetchApi('/auth/register', { method: 'POST', body: userData }),
  
  login: (credentials: { email: string; password: string }) => 
    fetchApi('/auth/login', { method: 'POST', body: credentials }),
  
  logout: () => 
    fetchApi('/auth/logout', { method: 'GET' }),
  
  verifyEmail: (token: string) => 
    fetchApi(`/auth/verify-email/${token}`, { method: 'GET' }),
  
  createPassword: (data: { userId: string; password: string }) => 
    fetchApi('/auth/create-password', { method: 'PUT', body: data }),
  
  resendVerification: (email: string) => 
    fetchApi('/auth/resend-verification', { method: 'POST', body: { email } }),
  
  updateEmail: (data: { userId: string; email: string }) => 
    fetchApi('/auth/update-email', { method: 'PUT', body: data }),
};

export const userApi = {
  getCurrentUser: () => 
    fetchApi('/users/me', { method: 'GET' }),
  
  updateUser: (userData: any) => 
    fetchApi('/users/me', { method: 'PUT', body: userData }),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) => 
    fetchApi('/users/password', { method: 'PUT', body: data }),
};

export const companyApi = {
  getCompany: (id: string) => 
    fetchApi(`/companies/${id}`, { method: 'GET' }),
  
  updateCompany: (id: string, companyData: any) => 
    fetchApi(`/companies/${id}`, { method: 'PUT', body: companyData }),
};
