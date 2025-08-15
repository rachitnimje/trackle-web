'use client'

import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Button, 
  Paper, 
  Breadcrumbs,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTemplate, deleteTemplate } from '../../../api/templates';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Template } from '../../../api/types';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';

export default function TemplateDetails() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

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
          console.log('Template data:', response.data); // Debug log
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
    setDeleteDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} href="/templates" color="inherit" underline="hover">
          Templates
        </MuiLink>
        <Typography color="text.primary" fontWeight={500}>
          {loading ? 'Loading...' : template?.name || 'Not Found'}
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
      ) : !template ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Template not found
          </Typography>
          <Button 
            component={Link} 
            href="/templates" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Browse Templates
          </Button>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <ListAltIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h1" fontWeight={700}>
                {template.name}
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
                  #{template.id || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Created:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {formatDate(template.created_at)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Updated:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {formatDate(template.updated_at)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
                  Exercises:
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {template.exercises?.length || 0}
                </Typography>
              </Box>
            </Box>

            {/* Description Section */}
            {template.description && (
              <Box sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2,
                backgroundColor: 'background.paper',
                mb: 4
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Description
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                  {template.description}
                </Typography>
              </Box>
            )}

            {/* Exercises Section */}
            <Box sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              mb: 4
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Exercise List
                </Typography>
              </Box>
              
              {template.exercises && template.exercises.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {template.exercises.map((exercise: {exercise?: {name?: string}, name?: string, sets: number}, index: number) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        px: 0,
                        py: 1,
                        borderBottom: index < template.exercises.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          backgroundColor: 'primary.main', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={exercise.exercise?.name || exercise.name || 'Unknown Exercise'}
                        secondary={`${exercise.sets} sets`}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No exercises in this template yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/templates')}
              size="large"
            >
              Back to Templates
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                size="large"
              >
                Delete Template
              </Button>
              
              {template.exercises && template.exercises.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  component={Link}
                  href={`/workouts/create?template=${templateId}`}
                  size="large"
                >
                  Start Workout
                </Button>
              )}
            </Box>
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
              Delete Template
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete "{template.name}"? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
}
