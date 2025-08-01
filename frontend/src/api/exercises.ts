import { api } from './apiClient';
import { ApiResponse, Exercise } from './types';

// Additional exercise properties for the UI
export interface ExtendedExercise extends Exercise {
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string;
  equipment?: string;
}

// Get all exercises
export const getExercises = async (): Promise<ApiResponse<Exercise[]>> => {
  return api.get<Exercise[]>('/exercises');
};

// Get a specific exercise by ID
export const getExercise = async (id: number): Promise<ApiResponse<Exercise>> => {
  return api.get<Exercise>(`/exercises/${id}`);
};

// Create a new exercise
export const createExercise = async (exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Exercise>> => {
  return api.post<Exercise>('/exercises', exercise);
};

// Update an exercise
export const updateExercise = async (id: number, exercise: Partial<Omit<Exercise, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Exercise>> => {
  return api.put<Exercise>(`/exercises/${id}`, exercise);
};

// Delete an exercise
export const deleteExercise = async (id: number): Promise<ApiResponse<null>> => {
  return api.delete<null>(`/exercises/${id}`);
};

// Search exercises by name or category
export const searchExercises = async (query: string): Promise<ApiResponse<Exercise[]>> => {
  return api.get<Exercise[]>(`/exercises/search?q=${query}`);
};

// Get exercises by category
export const getExercisesByCategory = async (category: string): Promise<ApiResponse<Exercise[]>> => {
  return api.get<Exercise[]>(`/exercises/category/${category}`);
};

// Common exercise categories for reference
export const exerciseCategories = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Balance',
  'Plyometric',
  'Powerlifting',
  'Olympic Weightlifting',
  'Calisthenics',
  'Functional'
];

// Common muscle groups for reference
export const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quadriceps',
  'Hamstrings',
  'Calves',
  'Abdominals',
  'Obliques',
  'Glutes',
  'Trapezius',
  'Lats',
  'Rhomboids',
  'Deltoids',
  'Abs',
  'Lower Back',
  'Traps'
];

// Common equipment types for reference
export const equipmentTypes = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Cable Machine',
  'Smith Machine',
  'Resistance Band',
  'Bodyweight',
  'Machine',
  'TRX/Suspension',
  'Medicine Ball',
  'Stability Ball',
  'Foam Roller',
  'Bench',
  'Pull-up Bar',
  'Treadmill',
  'Stationary Bike',
  'Elliptical',
  'Rowing Machine'
];

// Default exercises that can be used when no backend is available
export const defaultExercises: ExtendedExercise[] = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'Strength',
    description: 'A compound upper-body exercise that involves pressing a weight upwards from a supine position.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
    secondaryMuscles: ['Abs'],
    equipment: 'Barbell',
    instructions: 'Lie on a bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to the middle of your chest, then press back up to starting position.'
  },
  {
    id: 2,
    name: 'Squat',
    category: 'Strength',
    description: 'A compound lower-body exercise that involves bending the knees and hips to lower and raise the body.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    primaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Abs', 'Lower Back'],
    equipment: 'Barbell',
    instructions: 'Stand with feet shoulder-width apart. Place the barbell on your upper back. Bend your knees and hips to lower your body until thighs are parallel to the floor, then return to standing.'
  }
];
