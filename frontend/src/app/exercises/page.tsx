'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Breadcrumbs, 
  Link as MuiLink, 
  Divider,
  Pagination,
  Alert
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getExercises, 
  exerciseCategories, 
  muscleGroups, 
  defaultExercises, 
  ExtendedExercise 
} from '../../api/exercises';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Cookies from 'js-cookie';

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const exercisesPerPage = 12;
  
  // Check if user is logged in
  const isLoggedIn = !!Cookies.get('token');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await getExercises();
        if (response.success && response.data) {
          setExercises(response.data || defaultExercises);
        } else {
          console.error('API response unsuccessful:', response.error);
          setError('Failed to load exercises. Using default exercises instead.');
          setExercises(defaultExercises);
        }
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Failed to load exercises. Using default exercises instead.');
        setExercises(defaultExercises);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on search term and filters
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = searchTerm === '' || 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || exercise.category === selectedCategory;
    
    const matchesMuscle = selectedMuscle === '' || 
      (exercise.primaryMuscles && exercise.primaryMuscles.includes(selectedMuscle)) || 
      (exercise.secondaryMuscles && exercise.secondaryMuscles.includes(selectedMuscle));
    
    return matchesSearch && matchesCategory && matchesMuscle;
  });

  // Paginate exercises
  const indexOfLastExercise = page * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const pageCount = Math.ceil(filteredExercises.length / exercisesPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Exercises</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          <FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Exercise Library
        </Typography>
        
        {isLoggedIn && (
          <Button
            component={Link}
            href="/exercises/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Create Exercise
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ minWidth: '120px' }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
        
        {showFilters && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {exerciseCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Muscle Group</InputLabel>
              <Select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                label="Muscle Group"
              >
                <MenuItem value="">All Muscle Groups</MenuItem>
                {muscleGroups.map((muscle) => (
                  <MenuItem key={muscle} value={muscle}>
                    {muscle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'} found
          </Typography>
          
          {showFilters && (
            <Button 
              variant="text" 
              size="small" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedMuscle('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Paper>
      
      {currentExercises.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No exercises found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filters
          </Typography>
          {isLoggedIn && (
            <Button
              component={Link}
              href="/exercises/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Create Exercise
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            {currentExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {exercise.name}
                    </Typography>
                    
                    <Chip 
                      label={exercise.category} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exercise.description ? (
                        exercise.description.length > 100 
                          ? `${exercise.description.substring(0, 100)}...` 
                          : exercise.description
                      ) : (
                        "No description available"
                      )}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 1 }}>
                      Primary Muscles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 1 }}>
                      {exercise.primaryMuscles && exercise.primaryMuscles.map((muscle: string) => (
                        <Chip 
                          key={muscle} 
                          label={muscle} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                    
                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                      <>
                        <Typography variant="body2" fontWeight={500}>
                          Secondary Muscles:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {exercise.secondaryMuscles.map((muscle: string) => (
                            <Chip 
                              key={muscle} 
                              label={muscle} 
                              size="small" 
                              variant="outlined" 
                              color="secondary"
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      onClick={() => router.push(`/exercises/${exercise.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
            ))}
          </Box>
          
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
