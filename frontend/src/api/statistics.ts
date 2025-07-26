import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get workout statistics data
export const getWorkoutStats = async (token: string, timeRange: string = 'month') => {
  const response = await api.get(`/stats/workouts?timeRange=${timeRange}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get exercise progression data (weights over time)
export const getExerciseProgress = async (token: string, exerciseId: string, timeRange: string = 'month') => {
  const response = await api.get(`/stats/exercises/${exerciseId}?timeRange=${timeRange}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get aggregate statistics (counts, averages, etc.)
export const getAggregateStats = async (token: string) => {
  const response = await api.get('/stats/aggregate', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
