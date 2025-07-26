import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exercise types
export interface Exercise {
  id: number;
  name: string;
  category: string;
  description?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions?: string;
  equipment?: string;
}

// Get all exercises
export const getExercises = async () => {
  const response = await api.get('/exercises');
  return response.data;
};

// Get a specific exercise by ID
export const getExercise = async (id: number) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

// Create a new exercise
export const createExercise = async (exercise: Omit<Exercise, 'id'>) => {
  const response = await api.post('/exercises', exercise);
  return response.data;
};

// Update an exercise
export const updateExercise = async (id: number, exercise: Partial<Exercise>) => {
  const response = await api.put(`/exercises/${id}`, exercise);
  return response.data;
};

// Delete an exercise
export const deleteExercise = async (id: number) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};

// Search exercises by name or category
export const searchExercises = async (query: string) => {
  const response = await api.get(`/exercises/search?q=${query}`);
  return response.data;
};

// Get exercises by category
export const getExercisesByCategory = async (category: string) => {
  const response = await api.get(`/exercises/category/${category}`);
  return response.data;
};

// Get suggested exercises based on user history
export const getSuggestedExercises = async () => {
  const response = await api.get('/exercises/suggested');
  return response.data;
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
  'Glutes',
  'Abs',
  'Obliques',
  'Lower Back',
  'Traps',
  'Lats',
  'Deltoids'
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
export const defaultExercises: Exercise[] = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'Strength',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
    secondaryMuscles: ['Abs'],
    equipment: 'Barbell',
    description: 'A compound upper-body exercise that involves pressing a weight upwards from a supine position.',
    instructions: 'Lie on a bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to the middle of your chest, then press back up to starting position.'
  },
  {
    id: 2,
    name: 'Squat',
    category: 'Strength',
    primaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Abs', 'Lower Back'],
    equipment: 'Barbell',
    description: 'A compound lower-body exercise that involves bending the knees and hips to lower and raise the body.',
    instructions: 'Stand with feet shoulder-width apart. Place the barbell on your upper back. Bend your knees and hips to lower your body until thighs are parallel to the floor, then return to standing.'
  },
  {
    id: 3,
    name: 'Deadlift',
    category: 'Strength',
    primaryMuscles: ['Hamstrings', 'Lower Back', 'Glutes'],
    secondaryMuscles: ['Forearms', 'Traps', 'Quads'],
    equipment: 'Barbell',
    description: 'A compound exercise that involves lifting a weight from the ground to hip level.',
    instructions: 'Stand with feet hip-width apart. Bend at hips and knees to grip the bar. Keep your back straight. Lift the bar by extending your hips and knees until standing upright.'
  },
  {
    id: 4,
    name: 'Pull-up',
    category: 'Strength',
    primaryMuscles: ['Back', 'Biceps'],
    secondaryMuscles: ['Shoulders', 'Forearms'],
    equipment: 'Pull-up Bar',
    description: 'An upper-body compound pulling exercise that involves hanging from a bar and pulling the body upward.',
    instructions: 'Hang from a pull-up bar with hands slightly wider than shoulder-width. Pull your body up until your chin is over the bar, then lower back to the starting position.'
  },
  {
    id: 5,
    name: 'Overhead Press',
    category: 'Strength',
    primaryMuscles: ['Shoulders', 'Triceps'],
    secondaryMuscles: ['Upper Chest', 'Traps'],
    equipment: 'Barbell',
    description: 'A compound upper-body exercise that involves pressing a weight overhead from shoulder level.',
    instructions: 'Stand with feet shoulder-width apart. Hold the barbell at shoulder level. Press the weight overhead until arms are fully extended, then lower back to starting position.'
  },
  {
    id: 6,
    name: 'Bicep Curl',
    category: 'Strength',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
    description: 'An isolation exercise that targets the biceps by curling a weight toward the shoulder.',
    instructions: 'Stand with dumbbells in each hand, arms extended. Keeping your upper arms stationary, curl the weights toward your shoulders, then lower back to starting position.'
  },
  {
    id: 7,
    name: 'Tricep Extension',
    category: 'Strength',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Dumbbell',
    description: 'An isolation exercise that targets the triceps by extending the arm against resistance.',
    instructions: 'Hold a dumbbell with both hands above your head, arms extended. Lower the weight behind your head by bending your elbows, then extend your arms to return to starting position.'
  },
  {
    id: 8,
    name: 'Plank',
    category: 'Strength',
    primaryMuscles: ['Abs', 'Lower Back'],
    secondaryMuscles: ['Shoulders'],
    equipment: 'Bodyweight',
    description: 'A core exercise that involves maintaining a position similar to a push-up for the maximum possible time.',
    instructions: 'Get into a push-up position, but rest on your forearms instead of your hands. Keep your body in a straight line from head to heels. Hold this position.'
  },
  {
    id: 9,
    name: 'Lunges',
    category: 'Strength',
    primaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Calves', 'Abs'],
    equipment: 'Bodyweight',
    description: 'A lower-body exercise that works multiple muscle groups by stepping forward and lowering the hips.',
    instructions: 'Stand with feet together. Take a step forward with one leg and lower your hips until both knees are bent at a 90-degree angle. Return to standing and repeat with the other leg.'
  },
  {
    id: 10,
    name: 'Lat Pulldown',
    category: 'Strength',
    primaryMuscles: ['Back', 'Biceps'],
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable Machine',
    description: 'A compound exercise that targets the back muscles by pulling a bar down to chest level.',
    instructions: 'Sit at a lat pulldown machine with thighs secured. Grip the bar wider than shoulder-width. Pull the bar down to your upper chest, then slowly allow it to return to the starting position.'
  }
];
