import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTemplates = async (token: string) => {
  const response = await api.get('/templates', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTemplate = async (id: string, token: string) => {
  const response = await api.get(`/templates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTemplate = async (template: any, token: string) => {
  const response = await api.post('/templates', template, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTemplate = async (id: string, token: string) => {
  const response = await api.delete(`/templates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
