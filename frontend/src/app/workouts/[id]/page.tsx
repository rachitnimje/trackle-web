'use client';

import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWorkout } from '../../../api/workouts';
import Cookies from 'js-cookie';

export default function WorkoutDetails() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params?.id;
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const data = await getWorkout(workoutId as string, token);
        setWorkout(data.workout || data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load workout');
      } finally {
        setLoading(false);
      }
    };
    if (workoutId) fetchWorkout();
  }, [workoutId, router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : workout ? (
        <Box>
          <Typography variant="h4" gutterBottom>{workout.name || `Workout ${workout.id}`}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {formatDate(workout.created_at || workout.date)}
          </Typography>
          
          {workout.description && (
            <Typography variant="body1" paragraph>
              {workout.description}
            </Typography>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          {workout.exercises && workout.exercises.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>Exercises</Typography>
              
              {workout.exercises.map((exercise: any, index: number) => (
                <Paper key={exercise.id || index} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sets: {exercise.sets || exercise.weights?.length || 0}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Reps: {exercise.reps || "N/A"}
                    </Typography>
                    
                    {exercise.weights && exercise.weights.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Weights:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {exercise.weights.map((weight: number, i: number) => (
                            <Box 
                              key={i} 
                              sx={{ 
                                bgcolor: 'primary.light', 
                                color: 'white', 
                                py: 0.5, 
                                px: 1.5, 
                                borderRadius: 1,
                                minWidth: 40,
                                textAlign: 'center'
                              }}
                            >
                              <Typography variant="body2">
                                {weight} kg
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              No exercises found for this workout.
            </Alert>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => router.push('/workouts')}>
              Back to Workouts
            </Button>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
}
