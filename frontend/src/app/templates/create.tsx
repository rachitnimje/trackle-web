'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Chip, IconButton, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { createTemplate } from '../../api/templates';

const exerciseList = ['Bench Press', 'Deadlift', 'Squat', 'Pull Up', 'Shoulder Press', 'Bicep Curl', 'Tricep Extension'];

function getTokenFromCookie() {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : '';
}

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [sets, setSets] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddExercise = (exercise: string) => {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises([...selectedExercises, exercise]);
      setSets({ ...sets, [exercise]: 1 });
    }
  };

  const handleRemoveExercise = (exercise: string) => {
    setSelectedExercises(selectedExercises.filter(e => e !== exercise));
    const newSets = { ...sets };
    delete newSets[exercise];
    setSets(newSets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName) {
      setError('Template name is required');
      return;
    }
    if (selectedExercises.length === 0) {
      setError('At least one exercise must be selected');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = getTokenFromCookie();
      const templateData = {
        name: templateName,
        exercises: selectedExercises.map(exercise => ({
          name: exercise,
          sets: sets[exercise]
        }))
      };
      
      await createTemplate(templateData, token);
      router.push('/templates');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500, mx: 'auto' }}>
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
          <Typography variant="subtitle1" mb={1}>Add Exercises</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {exerciseList.map(exercise => (
              <Chip
                key={exercise}
                label={exercise}
                color={selectedExercises.includes(exercise) ? 'primary' : 'default'}
                onClick={() => handleAddExercise(exercise)}
                onDelete={selectedExercises.includes(exercise) ? () => handleRemoveExercise(exercise) : undefined}
                deleteIcon={<DeleteIcon />}
                disabled={loading}
              />
            ))}
          </Box>
          {selectedExercises.length > 0 && (
            <Box>
              <Typography variant="subtitle2" mb={1}>Sets per Exercise</Typography>
              {selectedExercises.map(exercise => (
                <Box key={exercise} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ minWidth: 120 }}>{exercise}</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={sets[exercise]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSets({ ...sets, [exercise]: Number(e.target.value) })}
                    sx={{ width: 80, mx: 2 }}
                    inputProps={{ min: 1 }}
                    disabled={loading}
                  />
                  <IconButton onClick={() => handleRemoveExercise(exercise)} color="error" disabled={loading}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Template'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}