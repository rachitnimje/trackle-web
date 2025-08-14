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
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getExercise } from '../../../api/exercises';
import { Exercise } from '../../../api/types';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
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
        // Fetch from API
        data = await getExercise(exerciseId);
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
        <MuiLink component={Link} href="/" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} href="/exercises" color="inherit" underline="hover">
          Exercises
        </MuiLink>
        <Typography color="text.primary" fontWeight={500}>
          {loading ? 'Loading...' : exercise?.name || 'Not Found'}
        </Typography>
      </Breadcrumbs>

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
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h1" fontWeight={700}>
                {exercise.name}
              </Typography>
            </Box>

            {/* Metadata Section */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 4, 
              p: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  ID:
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  #{exercise.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Created:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {new Date(exercise.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Updated:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {new Date(exercise.updated_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Exercise Details Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(250px, 1fr))' }, 
              gap: 3, 
              mb: 4 
            }}>
              {/* Category Section */}
              <Box sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Category
                  </Typography>
                </Box>
                <Chip 
                  label={exercise.category} 
                  color="primary" 
                  size="medium"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Primary Muscle Section - Only show if available */}
              {exercise.primary_muscle && (
                <Box sx={{ 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FitnessCenterOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Primary Muscle
                    </Typography>
                  </Box>
                  <Chip 
                    label={exercise.primary_muscle} 
                    color="secondary" 
                    size="medium"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              )}

              {/* Equipment Section - Only show if available */}
              {exercise.equipment && (
                <Box sx={{ 
                  p: 3, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Equipment
                    </Typography>
                  </Box>
                  <Chip 
                    label={exercise.equipment} 
                    variant="outlined" 
                    size="medium"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              )}
            </Box>

            {/* Description Section */}
            {exercise.description && (
              <Box sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2,
                backgroundColor: 'background.paper',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Description
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                  {exercise.description}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
}
