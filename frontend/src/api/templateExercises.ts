import { api } from './apiClient';
import { ApiResponse, TemplateExercise } from './types';

export const getTemplateExercises = async (templateId: number): Promise<ApiResponse<TemplateExercise[]>> => {
  return api.get<TemplateExercise[]>(`/templates/${templateId}/exercises`);
};

export const addExerciseToTemplate = async (
  templateId: number, 
  exerciseId: number, 
  sets: number
): Promise<ApiResponse<TemplateExercise>> => {
  return api.post<TemplateExercise>(`/templates/${templateId}/exercises`, {
    exercise_id: exerciseId,
    sets
  });
};

export const updateTemplateExercise = async (
  templateExerciseId: number,
  sets: number
): Promise<ApiResponse<TemplateExercise>> => {
  return api.put<TemplateExercise>(`/template-exercises/${templateExerciseId}`, { sets });
};

export const removeExerciseFromTemplate = async (
  templateExerciseId: number
): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/template-exercises/${templateExerciseId}`);
};
