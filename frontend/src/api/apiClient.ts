import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse, PaginatedResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const response = error.response;
    
    // Handle authentication errors
    if (response?.status === 401) {
      // Redirect to login if running on client
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API request methods
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data;
}

export async function getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
  const response = await apiClient.get<PaginatedResponse<T>>(url, config);
  return response.data;
}

export async function post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data;
}

export async function put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data;
}

export const api = {
  get,
  getPaginated,
  post,
  put,
  delete: del,
};
