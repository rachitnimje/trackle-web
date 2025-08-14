import { api } from "./apiClient";
import { ApiResponse, PaginatedResponse, Exercise } from "./types";

// Additional exercise properties for the UI
export interface ExtendedExercise extends Exercise {
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string;
  equipment?: string;
}

// Get all exercises with pagination
export const getExercises = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  muscle?: string
): Promise<PaginatedResponse<Exercise[]>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  if (muscle) params.append("muscle", muscle);
  return api.getPaginated<Exercise[]>(`/exercises?${params.toString()}`);
};

// Get a specific exercise by ID
export const getExercise = async (
  id: number
): Promise<ApiResponse<Exercise>> => {
  return api.get<Exercise>(`/exercises/${id}`);
};

// Create a new exercise
export const createExercise = async (
  exercise: Omit<Exercise, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Exercise>> => {
  return api.post<Exercise>("/exercises", exercise);
};

// Update an exercise
export const updateExercise = async (
  id: number,
  exercise: Partial<Omit<Exercise, "id" | "created_at" | "updated_at">>
): Promise<ApiResponse<Exercise>> => {
  return api.put<Exercise>(`/exercises/${id}`, exercise);
};

// Delete an exercise
export const deleteExercise = async (
  id: number
): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/exercises/${id}`);
};

// Get exercise categories from API
export const getExerciseCategories = async (): Promise<
  ApiResponse<string[]>
> => {
  return api.get<string[]>("/exercises/categories");
};

// Get primary muscles from API
export const getPrimaryMuscles = async (): Promise<ApiResponse<string[]>> => {
  return api.get<string[]>("/exercises/muscles");
};

// Get equipment types from API
export const getEquipmentTypes = async (): Promise<ApiResponse<string[]>> => {
  return api.get<string[]>("/exercises/equipment");
};

// Search exercises by name or category
export const searchExercises = async (
  query: string
): Promise<ApiResponse<Exercise[]>> => {
  return api.get<Exercise[]>(`/exercises/search?q=${query}`);
};

// Get exercises by category
export const getExercisesByCategory = async (
  category: string
): Promise<ApiResponse<Exercise[]>> => {
  return api.get<Exercise[]>(`/exercises/category/${category}`);
};
