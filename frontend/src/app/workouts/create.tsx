'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  CircularProgress
} from '@mui/material';
import { createWorkout } from '@/api/workouts';
import { getTemplates } from '@/api/templates';
import Cookies from 'js-cookie';

interface Template {
  id: string;
  name: string;
  description: string;
  exercises: TemplateExercise[];
}

interface TemplateExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest_time: number;
}

interface ExerciseWeight {
  exerciseId: string;
  weights: number[];
}

export default function CreateWorkout() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [exerciseWeights, setExerciseWeights] = useState<ExerciseWeight[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const fetchedTemplates = await getTemplates(token);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [router]);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId) || null;
      setSelectedTemplate(template);
      
      if (template) {
        // Initialize exercise weights
        const initialWeights = template.exercises.map(exercise => ({
          exerciseId: exercise.id,
          weights: Array(exercise.sets).fill(0)
        }));
        setExerciseWeights(initialWeights);
      } else {
        setExerciseWeights([]);
      }
    }
  }, [templateId, templates]);

  const handleWeightChange = (exerciseId: string, setIndex: number, weight: number) => {
    setExerciseWeights(prevWeights => {
      return prevWeights.map(ew => {
        if (ew.exerciseId === exerciseId) {
          const newWeights = [...ew.weights];
          newWeights[setIndex] = weight;
          return { ...ew, weights: newWeights };
        }
        return ew;
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Transform exercise weights to the format expected by the API
      const exercises = selectedTemplate.exercises.map(exercise => {
        const exerciseWeight = exerciseWeights.find(ew => ew.exerciseId === exercise.id);
        return {
          template_exercise_id: exercise.id,
          weights: exerciseWeight ? exerciseWeight.weights : Array(exercise.sets).fill(0)
        };
      });

      await createWorkout({
        name,
        description,
        template_id: templateId,
        exercises
      }, token);
      
      router.push('/workouts');
    } catch (error) {
      console.error('Error creating workout:', error);
      alert('Failed to create workout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Workout
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Workout Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="template-label">Template</InputLabel>
                <Select
                  labelId="template-label"
                  id="template"
                  value={templateId}
                  label="Template"
                  onChange={(e) => setTemplateId(e.target.value)}
                  required
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Exercises from Template: {selectedTemplate.name}
              </Typography>
              
              {selectedTemplate.exercises.map((exercise) => (
                <Box key={exercise.id} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {exercise.sets} sets × {exercise.reps} reps (Rest: {exercise.rest_time}s)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                      <Box key={setIndex} sx={{ width: { xs: '48%', sm: '31%', md: '23%' } }}>
                        <TextField
                          label={`Set ${setIndex + 1} Weight`}
                          type="number"
                          size="small"
                          fullWidth
                          inputProps={{ min: 0, step: 0.5 }}
                          value={
                            exerciseWeights.find(ew => ew.exerciseId === exercise.id)?.weights[setIndex] || 0
                          }
                          onChange={(e) => handleWeightChange(
                            exercise.id,
                            setIndex,
                            parseFloat(e.target.value) || 0
                          )}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting || !templateId}
            >
              {submitting ? <CircularProgress size={24} /> : 'Create Workout'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
