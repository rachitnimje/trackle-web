'use client';

import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  createExercise, 
  getExerciseCategories,
  getPrimaryMuscles,
  getEquipmentTypes
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
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  
  // Options from API
  const [categories, setCategories] = useState<string[]>([]);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [primaryMuscleError, setPrimaryMuscleError] = useState('');

  // Check if user is logged in
  const isLoggedIn = !!Cookies.get('token');

  // Fetch options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [categoriesRes, musclesRes, equipmentRes] = await Promise.all([
          getExerciseCategories(),
          getPrimaryMuscles(),
          getEquipmentTypes()
        ]);
        
        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }
        if (musclesRes.success) {
          setMuscles(musclesRes.data);
        }
        if (equipmentRes.success) {
          setEquipmentOptions(equipmentRes.data);
        }
      } catch (err) {
        console.error('Failed to load options:', err);
        setError('Failed to load form options');
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isLoggedIn) {
      fetchOptions();
    }
  }, [isLoggedIn]);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setCategoryError('');
    setPrimaryMuscleError('');
    
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
    
    // Primary muscle is optional, no validation needed
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const exerciseData = {
        name: name.trim(),
        category,
        description: description.trim(),
        primary_muscle: primaryMuscle,
        equipment: equipment || 'None'
      };
      
      const response = await createExercise(exerciseData);
      
      if (response.success) {
        setSuccess(true);
        
        // Reset form after successful creation
        setTimeout(() => {
          router.push('/exercises');
        }, 1500);
      } else {
        setError(response.error || response.message || 'Failed to create exercise');
      }
    } catch (err: any) {
      const errorInfo = err.errorInfo || {};
      setError(errorInfo.error || errorInfo.message || 'Failed to create exercise');
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

  if (loadingOptions) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading form options...</Typography>
        </Box>
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
                onChange={(e) => setCategory(e.target.value as string)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {categoryError && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {categoryError}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!primaryMuscleError}>
              <InputLabel>Primary Muscle</InputLabel>
              <Select
                value={primaryMuscle}
                onChange={(e) => setPrimaryMuscle(e.target.value as string)}
                label="Primary Muscle"
              >
                <MenuItem value="">None</MenuItem>
                {muscles.map((muscle) => (
                  <MenuItem key={muscle} value={muscle}>
                    {muscle}
                  </MenuItem>
                ))}
              </Select>
              {primaryMuscleError && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {primaryMuscleError}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Equipment</InputLabel>
              <Select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as string)}
                label="Equipment"
              >
                {equipmentOptions.map((eq) => (
                  <MenuItem key={eq} value={eq}>
                    {eq}
                  </MenuItem>
                ))}
              </Select>
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
            placeholder="Describe how to perform this exercise..."
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
