'use client';

import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Chip, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getExercise, defaultExercises, Exercise } from '../../../api/exercises';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Cookies from 'js-cookie';

export default function ExerciseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params?.id ? parseInt(params.id as string) : null;
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!Cookies.get('token');

  useEffect(() => {
    const fetchExercise = async () => {
      if (!exerciseId) return;
      
      setLoading(true);
      try {
        let data;
        try {
          // Try to fetch from API first
          data = await getExercise(exerciseId);
        } catch (error) {
          // Fallback to default exercises if API fails
          console.log('Using default exercises');
          const foundExercise = defaultExercises.find(ex => ex.id === exerciseId);
          if (foundExercise) {
            data = { data: foundExercise };
          } else {
            throw new Error('Exercise not found');
          }
        }
        
        setExercise(data.data || null);
      } catch (err: any) {
        setError(err.message || 'Failed to load exercise details');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (!isLoggedIn) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to view exercise details.
        </Alert>
        <Button 
          component={Link} 
          href="/auth/login" 
          variant="contained" 
          color="primary"
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} href="/exercises" color="inherit">
          Exercises
        </MuiLink>
        <Typography color="text.primary">
          {loading ? 'Loading...' : exercise?.name || 'Not Found'}
        </Typography>
      </Breadcrumbs>

      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push('/exercises')}
        sx={{ mb: 3 }}
      >
        Back to Exercises
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : !exercise ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Exercise not found
          </Typography>
          <Button 
            component={Link} 
            href="/exercises" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Browse Exercises
          </Button>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h4" component="h1" fontWeight={700}>
                    {exercise.name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Chip 
                    label={exercise.category} 
                    color="primary" 
                    sx={{ mr: 1 }} 
                  />
                  {exercise.equipment && (
                    <Chip 
                      label={exercise.equipment} 
                      variant="outlined" 
                    />
                  )}
                </Box>
                
                {exercise.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {exercise.description}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <FitnessCenterOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                    Muscles Worked
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Primary:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {exercise.primaryMuscles.map((muscle) => (
                      <Chip 
                        key={muscle} 
                        label={muscle} 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                  
                  {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Secondary:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {exercise.secondaryMuscles.map((muscle) => (
                          <Chip 
                            key={muscle} 
                            label={muscle} 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                {exercise.instructions && (
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <MenuBookIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                        Instructions
                      </Typography>
                      <List>
                        {exercise.instructions.split('. ').filter(Boolean).map((step, index) => (
                          <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleOutlineIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={`${step}${!step.endsWith('.') ? '.' : ''}`} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/exercises')}
            >
              Back to Exercises
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FitnessCenterIcon />}
              onClick={() => router.push('/workouts/create')}
            >
              Add to Workout
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
