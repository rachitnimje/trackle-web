'use client';

import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Alert, 
  Link as MuiLink, 
  IconButton, 
  Paper, 
  Divider,
  useTheme,
  alpha 
} from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getWorkouts, deleteWorkout } from '../../api/workouts';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserWorkoutsResponse } from '../../api/types';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState<UserWorkoutsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const theme = useTheme();

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
        
        const response = await getWorkouts();
        
        if (response.success && response.data) {
          setWorkouts(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.error || response.message || 'Failed to load workouts');
        }
      } catch (err: any) {
        const errorInfo = err.errorInfo || {};
        setError(errorInfo.error || errorInfo.message || 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [router]);

  return (
    <Container 
      maxWidth="md" 
      sx={{ mt: 4, pb: 5 }}
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} component={motion.div} variants={itemVariants}>
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
            px: 3,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
          }}
        >
          Create Workout
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress color="primary" /></Box>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        </motion.div>
      ) : workouts.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
              boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>No workouts found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your fitness journey by creating your first workout
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              href="/workouts/create"
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
              }}
            >
              Create Your First Workout
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              background: theme.palette.background.paper,
              boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <List disablePadding>
              {workouts.map((workout: UserWorkoutsResponse, index: number) => (
                <React.Fragment key={workout.workout_id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem 
                    disableGutters
                    sx={{ 
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'translateY(-2px)'
                      }
                    }}
                    component={motion.li}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.5
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={async (e) => {
                          e.preventDefault();
                          if (window.confirm('Are you sure you want to delete this workout?')) {
                            try {
                              const response = await deleteWorkout(workout.workout_id.toString());
                              if (response.success) {
                                setWorkouts(prev => prev.filter(w => w.workout_id !== workout.workout_id));
                              } else {
                                setError(response.error || response.message || 'Failed to delete workout');
                              }
                            } catch (err: any) {
                              const errorInfo = err.errorInfo || {};
                              setError(errorInfo.error || errorInfo.message || 'Failed to delete workout');
                            }
                          }
                        }}
                        sx={{ 
                          color: 'error.main',
                          mr: 1,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1)
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <MuiLink 
                      component={Link} 
                      href={`/workouts/${workout.workout_id}`} 
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
                            {workout.workout_name || `Workout ${workout.workout_id}`}
                          </Typography>
                        } 
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(workout.logged_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Template: {workout.template_name}
                            </Typography>
                            {workout.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                {workout.notes}
                              </Typography>
                            )}
                          </Box>
                        } 
                      />
                    </MuiLink>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </motion.div>
      )}
    </Container>
  );
}
