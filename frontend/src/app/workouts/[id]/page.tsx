'use client';

import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWorkout } from '../../../api/workouts';
import Cookies from 'js-cookie';
import { UserWorkoutResponse } from '../../../api/types';

export default function WorkoutDetails() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params?.id;
  const [workout, setWorkout] = useState<UserWorkoutResponse | null>(null);
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
        
        const response = await getWorkout(workoutId as string);
        
        if (response.success && response.data) {
          setWorkout(response.data);
        } else {
          setError(response.error || response.message || 'Failed to load workout');
        }
      } catch (err: any) {
        const errorInfo = err.errorInfo || {};
        setError(errorInfo.error || errorInfo.message || 'Failed to load workout');
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
          <Typography variant="h4" gutterBottom>{workout.workout_name || `Workout ${workout.id}`}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Template: {workout.template_name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {formatDate(workout.created_at)}
          </Typography>
          
          {workout.notes && (
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              Notes: {workout.notes}
            </Typography>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          {workout.entries && workout.entries.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>Exercise Entries</Typography>
              
              {/* Group entries by exercise */}
              {Object.entries(
                workout.entries.reduce((acc: Record<string, {name: string, entries: typeof workout.entries}>, entry) => {
                  if (!acc[entry.exercise_id]) {
                    acc[entry.exercise_id] = {
                      name: entry.exercise_name,
                      entries: []
                    };
                  }
                  acc[entry.exercise_id].entries.push(entry);
                  return acc;
                }, {})
              ).map(([exerciseId, exerciseData]: [string, {name: string, entries: typeof workout.entries}]) => (
                <Paper key={exerciseId} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {exerciseData.name}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sets performed: {exerciseData.entries.length}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      {exerciseData.entries
                        .sort((a, b) => a.set_number - b.set_number)
                        .map((entry, index: number) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1,
                            bgcolor: 'grey.100',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" sx={{ minWidth: 60 }}>
                            Set {entry.set_number}:
                          </Typography>
                          <Typography variant="body2">
                            {entry.reps} reps
                          </Typography>
                          {entry.weight > 0 && (
                            <Typography variant="body2">
                              @ {entry.weight} kg
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              No exercise entries found for this workout.
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
