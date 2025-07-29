'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  createExercise, 
  exerciseCategories, 
  muscleGroups, 
  equipmentTypes 
} from '../../../api/exercises';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Cookies from 'js-cookie';

export default function CreateExercisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [primaryMuscles, setPrimaryMuscles] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [primaryMusclesError, setPrimaryMusclesError] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!Cookies.get('token');

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setCategoryError('');
    setPrimaryMusclesError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Exercise name is required');
      isValid = false;
    }
    
    // Validate category
    if (!category) {
      setCategoryError('Category is required');
      isValid = false;
    }
    
    // Validate primary muscles
    if (primaryMuscles.length === 0) {
      setPrimaryMusclesError('At least one primary muscle is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Prepare exercise data - ensure all required fields are strings, not undefined
      const exerciseData = {
        name,
        category,
        description: description || "", // Default to empty string for required fields
        primaryMuscles,
        secondaryMuscles: secondaryMuscles.length > 0 ? secondaryMuscles : undefined,
        equipment: equipment || undefined,
        instructions: instructions || undefined
      };
      
      const response = await createExercise(exerciseData);
      
      if (response.success) {
        setSuccess(true);
        
        // Reset form after successful creation
        setTimeout(() => {
          router.push('/exercises');
        }, 1500);
      } else {
        setError(response.error || 'Failed to create exercise');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create exercise');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to create exercises.
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
        <Typography color="text.primary">Create New Exercise</Typography>
      </Breadcrumbs>
      
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push('/exercises')}
        sx={{ mb: 3 }}
      >
        Back to Exercises
      </Button>
      
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Create New Exercise
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below to add a new exercise to your library.
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Exercise created successfully! Redirecting...
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 3, 
            mb: 3 
          }}>
            <TextField
              label="Exercise Name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
            />
            
            <FormControl fullWidth required error={!!categoryError}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {exerciseCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {categoryError && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                  {categoryError}
                </Typography>
              )}
            </FormControl>
          </Box>
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 3, 
            mb: 3 
          }}>
            <FormControl fullWidth required error={!!primaryMusclesError}>
              <Autocomplete
                multiple
                options={muscleGroups}
                value={primaryMuscles}
                onChange={(_, newValue) => setPrimaryMuscles(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Primary Muscles" 
                    required
                    error={!!primaryMusclesError}
                    helperText={primaryMusclesError}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option} 
                      {...getTagProps({ index })} 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))
                }
              />
            </FormControl>
            
            <Autocomplete
              multiple
              options={muscleGroups.filter(muscle => !primaryMuscles.includes(muscle))}
              value={secondaryMuscles}
              onChange={(_, newValue) => setSecondaryMuscles(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Secondary Muscles"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip 
                    label={option} 
                    {...getTagProps({ index })} 
                    variant="outlined" 
                  />
                ))
              }
            />
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 3, 
            mb: 3 
          }}>
            <FormControl fullWidth>
              <InputLabel>Equipment</InputLabel>
              <Select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                label="Equipment"
              >
                <MenuItem value="">None</MenuItem>
                {equipmentTypes.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            label="Instructions"
            fullWidth
            multiline
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Provide step-by-step instructions for performing this exercise correctly."
            sx={{ mb: 4 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/exercises')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Exercise'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
