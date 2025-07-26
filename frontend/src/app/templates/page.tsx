'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, IconButton, Container, Tooltip, Divider } from '@mui/material';
import Link from 'next/link';
import { getTemplates, deleteTemplate } from '../../api/templates';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListAltIcon from '@mui/icons-material/ListAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const data = await getTemplates(token);
        setTemplates(data.templates || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} /> Workout Templates
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          href="/templates/create" 
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Create Template
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress color="primary" /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      ) : templates.length === 0 ? (
        <Paper 
          elevation={2}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)'
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>No templates found.</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            href="/templates/create"
            startIcon={<AddIcon />}
          >
            Create Your First Template
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {templates.map((template) => (
            <Paper
              key={template.id}
              elevation={3}
              sx={{
                p: 0,
                borderRadius: 2,
                height: '100%',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                },
                background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
                borderTop: '3px solid #ff1744'
              }}
            >
              <Box sx={{ p: 3, pb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                    {template.name}
                  </Typography>
                  <Tooltip title="Delete template">
                    <IconButton 
                      size="small"
                      sx={{ color: '#ff1744', ml: 1 }}
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this template?')) {
                          try {
                            const token = Cookies.get('token');
                            if (!token) {
                              router.push('/auth/login');
                              return;
                            }
                            await deleteTemplate(template.id, token);
                            setTemplates(prev => prev.filter(t => t.id !== template.id));
                          } catch (err: any) {
                            setError(err.response?.data?.message || 'Failed to delete template');
                          }
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                  <FitnessCenterIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {template.exercises?.length || 0} exercise{template.exercises?.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.exercises?.length > 0 
                    ? template.exercises.slice(0, 3).join(', ') + (template.exercises.length > 3 ? '...' : '')
                    : 'No exercises added yet'}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  href={`/templates/${template.id}`} 
                  startIcon={<VisibilityIcon />}
                  size="small"
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
