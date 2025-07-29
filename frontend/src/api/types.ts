export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  status?: number; // HTTP status code for error handling
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
  status: number; // HTTP status code
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  page: number;
  limit: number;
  total_pages: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponseData {
  token: string;
}

export interface RegisterResponseData {
  user: User;
}

// Exercise types
export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Template types
export interface TemplateExercise {
  id: number;
  template_id: number;
  exercise_id: number;
  sets: number;
  created_at: string;
  updated_at: string;
  exercise: Exercise;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  exercises: TemplateExercise[];
}

// Workout types
export interface WorkoutEntry {
  id: number;
  workout_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight: number;
  created_at: string;
  updated_at: string;
  exercise: Exercise;
}

export interface Workout {
  id: number;
  user_id: number;
  template_id: number;
  name: string;
  notes: string;
  created_at: string;
  updated_at: string;
  entries: WorkoutEntry[];
}

// Create request types
export interface CreateTemplateRequest {
  name: string;
  description: string;
  exercises: {
    exercise_id: number;
    sets: number;
  }[];
}

export interface CreateWorkoutRequest {
  template_id: number;
  name: string;
  notes?: string;
  entries: {
    exercise_id: number;
    set_number: number;
    reps: number;
    weight: number;
  }[];
}
