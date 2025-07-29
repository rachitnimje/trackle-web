import { api } from './apiClient';
import { ApiResponse, Template, CreateTemplateRequest } from './types';

export const getTemplates = async (): Promise<ApiResponse<Template[]>> => {
  return api.get<Template[]>('/me/templates');
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
