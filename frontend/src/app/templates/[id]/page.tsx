'use client'

import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTemplate, deleteTemplate } from '../../../api/templates';
import Link from 'next/link';

function getTokenFromCookie() {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : '';
}

export default function TemplateDetails() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id;
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getTokenFromCookie();
        const response = await getTemplate(templateId as string, token);
        setTemplate(response.template || response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };
    if (templateId) fetchTemplate();
  }, [templateId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }
    try {
      const token = getTokenFromCookie();
      await deleteTemplate(templateId as string, token);
      router.push('/templates');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete template');
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
          
          <Typography variant="h6" mt={3} mb={1}>Exercises</Typography>
          {template.exercises && template.exercises.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {template.exercises.map((exercise: any, index: number) => (
                <Chip 
                  key={index}
                  label={`${exercise.name || exercise.exercise?.name} - ${exercise.sets} sets`} 
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
