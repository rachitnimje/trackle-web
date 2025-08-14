'use client'

import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTemplate, deleteTemplate } from '../../../api/templates';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Template } from '../../../api/types';

export default function TemplateDetails() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await getTemplate(templateId as string);
        
        if (response.success && response.data) {
          setTemplate(response.data);
        } else {
          setError(response.error || response.message || 'Failed to load template');
        }
      } catch (err: any) {
        const errorInfo = err.errorInfo || {};
        setError(errorInfo.error || errorInfo.message || 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };
    if (templateId) fetchTemplate();
  }, [templateId, router]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }
    try {
      const response = await deleteTemplate(templateId as string);
      if (response.success) {
        router.push('/templates');
      } else {
        setError(response.error || response.message || 'Failed to delete template');
      }
    } catch (err: any) {
      const errorInfo = err.errorInfo || {};
      setError(errorInfo.error || errorInfo.message || 'Failed to delete template');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : template ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">{template.name}</Typography>
            <Button variant="outlined" color="error" onClick={handleDelete}>Delete Template</Button>
          </Box>
          
          {template.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {template.description}
            </Typography>
          )}
          
          <Typography variant="h6" mt={3} mb={1}>Exercises</Typography>
          {template.exercises && template.exercises.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {template.exercises.map((exercise: {exercise?: {name?: string}, name?: string, sets: number}, index: number) => (
                <Chip 
                  key={index}
                  label={`${exercise.exercise?.name || exercise.name} - ${exercise.sets} sets`} 
                  color="primary"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body1">No exercises in this template.</Typography>
          )}

          <Box mt={4} display="flex" gap={2}>
            <Button variant="contained" color="primary" component={Link} href={`/workouts/create?template=${templateId}`}>
              Start Workout
            </Button>
            <Button variant="outlined" onClick={() => router.push('/templates')}>
              Back to Templates
            </Button>
          </Box>
        </Paper>
      ) : null}
    </Container>
  );
}
