'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, IconButton, Alert, CircularProgress, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { createTemplate } from '../../api/templates';
import { getExercises } from '../../api/exercises';
import Cookies from 'js-cookie';
import { Exercise } from '../../api/types';

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<{exercise_id: number; name: string; sets: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoadingExercises(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await getExercises(1, 100);
        if (response.success && response.data) {
          setAvailableExercises(response.data);
        }
      } catch (err) {
        console.error('Failed to load exercises:', err);
        setError('Failed to load exercises');
      } finally {
        setLoadingExercises(false);
      }
    };
    fetchExercises();
  }, [router]);

  const handleAddExercise = (exercise: Exercise | null) => {
    if (exercise && !selectedExercises.find(e => e.exercise_id === exercise.id)) {
      setSelectedExercises([...selectedExercises, {
        exercise_id: exercise.id,
        name: exercise.name,
        sets: 1
      }]);
    }
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(e => e.exercise_id !== exerciseId));
  };

  const handleSetsChange = (exerciseId: number, sets: number) => {
    setSelectedExercises(selectedExercises.map(exercise => 
      exercise.exercise_id === exerciseId 
        ? { ...exercise, sets: Math.max(1, sets) }
        : exercise
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }
    if (!templateDescription.trim()) {
      setError('Template description is required');
      return;
    }
    if (selectedExercises.length === 0) {
      setError('At least one exercise must be selected');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const templateData = {
        name: templateName.trim(),
        description: templateDescription.trim(),
        exercises: selectedExercises.map(exercise => ({
          exercise_id: exercise.exercise_id,
          sets: exercise.sets
        }))
      };
      
      const response = await createTemplate(templateData);
      if (response.success) {
        router.push('/templates');
      } else {
        setError(response.error || response.message || 'Failed to create template');
      }
    } catch (err: any) {
      const errorInfo = err.errorInfo || {};
      setError(errorInfo.error || errorInfo.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Create Workout Template</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Template Name" 
            value={templateName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateName(e.target.value)} 
            sx={{ mb: 2 }}
            disabled={loading}
            required
          />
          <TextField 
            fullWidth 
            label="Template Description" 
            value={templateDescription} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateDescription(e.target.value)} 
            sx={{ mb: 2 }}
            multiline
            rows={2}
            disabled={loading}
            required
          />
          
          <Typography variant="subtitle1" mb={1}>Add Exercises</Typography>
          {loadingExercises ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Autocomplete
              options={availableExercises.filter(ex => !selectedExercises.find(selected => selected.exercise_id === ex.id))}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search exercises"
                  placeholder="Type to search..."
                />
              )}
              onChange={(event, value) => handleAddExercise(value)}
              value={null}
              sx={{ mb: 2 }}
              disabled={loading}
            />
          )}
          
          {selectedExercises.length > 0 && (
            <Box>
              <Typography variant="subtitle2" mb={1}>Selected Exercises</Typography>
              {selectedExercises.map(exercise => (
                <Box key={exercise.exercise_id} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography sx={{ flex: 1 }}>{exercise.name}</Typography>
                  <Typography sx={{ mx: 2, minWidth: 40 }}>Sets:</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={exercise.sets}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetsChange(exercise.exercise_id, Number(e.target.value))}
                    sx={{ width: 80, mx: 1 }}
                    inputProps={{ min: 1, max: 10 }}
                    disabled={loading}
                  />
                  <IconButton onClick={() => handleRemoveExercise(exercise.exercise_id)} color="error" disabled={loading}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => router.push('/templates')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={loading || selectedExercises.length === 0}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Template'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}