import { api } from './apiClient';
import { ApiResponse, LoginResponseData, RegisterResponseData } from './types';

export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponseData>> => {
  return api.post<LoginResponseData>('/auth/login', { email, password });
};

export const register = async (email: string, password: string, username: string): Promise<ApiResponse<RegisterResponseData>> => {
  return api.post<RegisterResponseData>('/auth/register', { email, password, username });
};

export const checkAuth = async (): Promise<ApiResponse<{ authenticated: boolean }>> => {
  return api.get<{ authenticated: boolean }>('/auth/check');
};
