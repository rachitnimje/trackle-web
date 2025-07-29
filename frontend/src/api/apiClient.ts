import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse, PaginatedResponse, ErrorResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1'; // Add API prefix for backend routes

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
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'An error occurred',
      error: error.message,
      status: response?.status || 0
    };
    
    // Handle different types of errors
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - Redirect to login if running on client
          errorResponse.message = 'You need to log in to access this resource';
          if (typeof window !== 'undefined') {
            Cookies.remove('token');
            window.location.href = '/auth/login';
          }
          break;
        case 404:
          // Not Found - You might want to handle this specifically
          errorResponse.message = 'The requested resource was not found';
          console.error('Resource not found:', error.config?.url);
          break;
        case 500:
          // Server Error
          errorResponse.message = 'A server error occurred, please try again later';
          console.error('Server error occurred:', error.message);
          break;
        default:
          // Other errors
          errorResponse.message = `Error: ${response.status} - ${error.message}`;
          console.error(`API Error (${response.status}):`, error.message);
      }
    } else {
      // Network errors (no response from server)
      errorResponse.message = 'Network error: Unable to connect to the server';
      console.error('Network error:', error.message);
    }
    
    // Attach the error info to the error object for easier access in components
    (error as any).errorInfo = errorResponse;
    
    return Promise.reject(error);
  }
);

// Generic API request methods
export const api = {
  get: async function<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Add API_PREFIX to all routes except login, register and other public endpoints
    const fullUrl = url.startsWith('/login') || url.startsWith('/register') ? 
      url : `${API_PREFIX}${url}`;
    const response = await apiClient.get<ApiResponse<T>>(fullUrl, config);
    return response.data;
  },
  
  post: async function<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('/login') || url.startsWith('/register') ? 
      url : `${API_PREFIX}${url}`;
    const response = await apiClient.post<ApiResponse<T>>(fullUrl, data, config);
    return response.data;
  },
  
  put: async function<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('/login') || url.startsWith('/register') ? 
      url : `${API_PREFIX}${url}`;
    const response = await apiClient.put<ApiResponse<T>>(fullUrl, data, config);
    return response.data;
  },
  
  delete: async function<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('/login') || url.startsWith('/register') ? 
      url : `${API_PREFIX}${url}`;
    const response = await apiClient.delete<ApiResponse<T>>(fullUrl, config);
    return response.data;
  },
  
  getPaginated: async function<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    const fullUrl = url.startsWith('/login') || url.startsWith('/register') ? 
      url : `${API_PREFIX}${url}`;
    const response = await apiClient.get<PaginatedResponse<T>>(fullUrl, config);
    return response.data;
  }
};
