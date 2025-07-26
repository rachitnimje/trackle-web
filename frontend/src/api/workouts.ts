import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWorkouts = async (token: string) => {
  const response = await api.get('/workouts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getWorkout = async (id: string, token: string) => {
  const response = await api.get(`/workouts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createWorkout = async (workout: any, token: string) => {
  const response = await api.post('/workouts', workout, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteWorkout = async (id: string, token: string) => {
  const response = await api.delete(`/workouts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
