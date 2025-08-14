import { api } from './apiClient';
import { ApiResponse, PaginatedResponse, Template, CreateTemplateRequest } from './types';

export const getTemplates = async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Template[]>> => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append('search', search);
  return api.getPaginated<Template[]>(`/me/templates?${params.toString()}`);
};

export const getTemplate = async (id: string): Promise<ApiResponse<Template>> => {
  return api.get<Template>(`/me/templates/${id}`);
};

export const createTemplate = async (template: CreateTemplateRequest): Promise<ApiResponse<Template>> => {
  return api.post<Template>('/me/templates', template);
};

export const updateTemplate = async (id: string, template: Partial<CreateTemplateRequest>): Promise<ApiResponse<Template>> => {
  return api.put<Template>(`/me/templates/${id}`, template);
};

export const deleteTemplate = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/me/templates/${id}`);
};
