import { api } from './apiClient';
import { ApiResponse, PaginatedResponse, UserWorkoutsResponse, UserWorkoutResponse, CreateWorkoutRequest } from './types';

export const getWorkouts = async (page: number = 1, limit: number = 10, search?: string, template_id?: string): Promise<PaginatedResponse<UserWorkoutsResponse[]>> => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append('search', search);
  if (template_id) params.append('template_id', template_id);
  return api.getPaginated<UserWorkoutsResponse[]>(`/me/workouts?${params.toString()}`);
};

export const getWorkout = async (id: string): Promise<ApiResponse<UserWorkoutResponse>> => {
  return api.get<UserWorkoutResponse>(`/me/workouts/${id}`);
};

export const createWorkout = async (workout: CreateWorkoutRequest): Promise<ApiResponse<UserWorkoutResponse>> => {
  return api.post<UserWorkoutResponse>('/me/workouts', workout);
};

export const updateWorkout = async (id: string, workout: Partial<CreateWorkoutRequest>): Promise<ApiResponse<UserWorkoutResponse>> => {
  return api.put<UserWorkoutResponse>(`/me/workouts/${id}`, workout);
};

export const deleteWorkout = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/me/workouts/${id}`);
};
