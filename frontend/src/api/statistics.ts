import { api } from './apiClient';
import { ApiResponse } from './types';

// Interfaces for statistics responses
export interface WorkoutStats {
  total_workouts: number;
  workout_frequency: Record<string, number>;
  workout_duration: Record<string, number>;
  most_used_templates: Array<{
    template_id: number;
    template_name: string;
    count: number;
  }>;
}

export interface ExerciseProgress {
  exercise_id: number;
  exercise_name: string;
  weights: Array<{
    date: string;
    weight: number;
    reps: number;
  }>;
  max_weight: number;
  min_weight: number;
  average_weight: number;
}

export interface AggregateStats {
  total_workouts: number;
  total_exercises: number;
  total_templates: number;
  total_weight_lifted: number;
  workout_streak: number;
  favorite_exercise: {
    id: number;
    name: string;
    count: number;
  };
}

// Get workout statistics data
export const getWorkoutStats = async (timeRange: string = 'month'): Promise<ApiResponse<WorkoutStats>> => {
  return api.get<WorkoutStats>(`/stats/workouts?timeRange=${timeRange}`);
};

// Get exercise progression data (weights over time)
export const getExerciseProgress = async (exerciseId: string, timeRange: string = 'month'): Promise<ApiResponse<ExerciseProgress>> => {
  return api.get<ExerciseProgress>(`/stats/exercises/${exerciseId}?timeRange=${timeRange}`);
};

// Get aggregate statistics (counts, averages, etc.)
export const getAggregateStats = async (): Promise<ApiResponse<AggregateStats>> => {
  return api.get<AggregateStats>('/stats/aggregate');
};
