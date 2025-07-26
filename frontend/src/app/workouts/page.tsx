'use client';

import { Container, Typography, Button, Box, CircularProgress, List, ListItem, ListItemText, Alert, Link as MuiLink, IconButton, Paper, Divider } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getWorkouts, deleteWorkout } from '../../api/workouts';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const data = await getWorkouts(token);
        setWorkouts(data.workouts || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [router]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} /> Workouts
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          href="/workouts/create" 
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Create Workout
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress color="primary" /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      ) : workouts.length === 0 ? (
        <Paper 
          elevation={2}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)'
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>No workouts found.</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            href="/workouts/create"
            startIcon={<AddIcon />}
          >
            Create Your First Workout
          </Button>
        </Paper>
      ) : (
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)'
          }}
        >
          <List disablePadding>
            {workouts.map((workout: any, index: number) => (
              <React.Fragment key={workout.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem 
                  disableGutters
                  sx={{ 
                    transition: 'background-color 0.3s',
                    '&:hover': { bgcolor: 'rgba(255, 23, 68, 0.08)' }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this workout?')) {
                          try {
                            const token = Cookies.get('token');
                            if (!token) {
                              router.push('/auth/login');
                              return;
                            }
                            await deleteWorkout(workout.id, token);
                            setWorkouts(prev => prev.filter(w => w.id !== workout.id));
                          } catch (err: any) {
                            setError(err.response?.data?.message || 'Failed to delete workout');
                          }
                        }
                      }}
                      sx={{ color: '#ff1744' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <MuiLink 
                    component={Link} 
                    href={`/workouts/${workout.id}`} 
                    underline="none" 
                    sx={{ 
                      width: '100%', 
                      display: 'block', 
                      py: 2,
                      px: 3,
                      color: 'text.primary'
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Typography variant="h6" fontWeight={600}>
                          {workout.name || `Workout ${workout.id}`}
                        </Typography>
                      } 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">{workout.date}</Typography>
                        </Box>
                      } 
                    />
                  </MuiLink>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}
