import { api } from './apiClient';
import { ApiResponse, PaginatedResponse, Workout, CreateWorkoutRequest } from './types';

export const getWorkouts = async (): Promise<ApiResponse<Workout[]>> => {
  return api.get<Workout[]>('/me/workouts');
};

export const getWorkout = async (id: string): Promise<ApiResponse<Workout>> => {
  return api.get<Workout>(`/me/workouts/${id}`);
};

export const createWorkout = async (workout: CreateWorkoutRequest): Promise<ApiResponse<Workout>> => {
  return api.post<Workout>('/me/workouts', workout);
};

export const updateWorkout = async (id: string, workout: Partial<CreateWorkoutRequest>): Promise<ApiResponse<Workout>> => {
  return api.put<Workout>(`/me/workouts/${id}`, workout);
};

export const deleteWorkout = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/me/workouts/${id}`);
};
