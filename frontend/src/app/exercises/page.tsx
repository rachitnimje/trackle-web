"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getExercises,
  getExerciseCategories,
  getPrimaryMuscles,
  ExtendedExercise,
} from "../../api/exercises";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Cookies from "js-cookie";

export default function ExercisesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API data
  const [categories, setCategories] = useState<string[]>([]);
  const [muscles, setMuscles] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Search and filters - initialize from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedMuscle, setSelectedMuscle] = useState(
    searchParams.get("muscle") || ""
  );

  // Pagination - initialize from URL params, default to 1
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  });
  const exercisesPerPage = 9;

  // Check if user is logged in
  const isLoggedIn = !!Cookies.get("token");

  // Redirect to page 1 if no page parameter is present
  useEffect(() => {
    const currentPage = searchParams.get("page");
    if (!currentPage) {
      const params = new URLSearchParams();
      params.set("page", "1");
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedMuscle) params.set("muscle", selectedMuscle);
      
      router.replace(`/exercises?${params.toString()}`, { scroll: false });
      return;
    }
  }, [searchParams, searchTerm, selectedCategory, selectedMuscle, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exercisesResponse, categoriesResponse, musclesResponse] =
          await Promise.all([
            getExercises(
              page,
              exercisesPerPage,
              selectedCategory || undefined,
              searchTerm || undefined,
              selectedMuscle || undefined
            ),
            getExerciseCategories(),
            getPrimaryMuscles(),
          ]);

        if (exercisesResponse.success && exercisesResponse.data) {
          console.log("Exercises response:", exercisesResponse.data);
          setExercises(exercisesResponse.data);
          setTotalCount(exercisesResponse.total || 0);
        } else {
          console.error("API response unsuccessful:", exercisesResponse.error);
          setError("Failed to load exercises.");
          setExercises([]);
          setTotalCount(0);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        if (musclesResponse.success && musclesResponse.data) {
          setMuscles(musclesResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data.");
        setExercises([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Always update URL with current filters including page
    const params = new URLSearchParams();
    params.set("page", page.toString()); // Always include page parameter
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedMuscle) params.set("muscle", selectedMuscle);

    const newUrl = `?${params.toString()}`;
    router.replace(`/exercises${newUrl}`, { scroll: false });
  }, [page, selectedCategory, searchTerm, selectedMuscle, router]);

  // Server-side pagination - exercises are already filtered and paginated
  const pageCount = Math.ceil(totalCount / exercisesPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleMuscleChange = (value: string) => {
    setSelectedMuscle(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          <FitnessCenterIcon sx={{ mr: 1, verticalAlign: "middle" }} />
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

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
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
              onChange={(e) => handleMuscleChange(e.target.value)}
              label="Muscle Group"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 250,
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
            >
              <MenuItem value="">All Muscle Groups</MenuItem>
              {muscles.map((muscle) => (
                <MenuItem key={muscle} value={muscle}>
                  {muscle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="text"
            size="large"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedMuscle("");
              setPage(1);
            }}
            sx={{ minWidth: "80px", alignSelf: "center" }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {exercises.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            {exercises.map((exercise, index) => (
              <Card
                key={exercise.id || `exercise-${index}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => {
                  console.log("Exercise clicked:", exercise.id, exercise);
                  if (exercise.id) {
                    router.push(`/exercises/${exercise.id}`);
                  } else {
                    console.error("Exercise ID is missing:", exercise);
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {exercise.name || "Unnamed Exercise"}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {exercise.category && (
                      <Chip
                        label={exercise.category}
                        color="primary"
                        size="small"
                      />
                    )}

                    {exercise.primary_muscle && (
                      <Chip
                        label={exercise.primary_muscle}
                        color="secondary"
                        size="small"
                      />
                    )}

                    {exercise.equipment &&
                      exercise.equipment.toLowerCase() !== "none" && (
                        <Chip
                          label={exercise.equipment}
                          variant="outlined"
                          size="small"
                        />
                      )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {exercise.description
                      ? exercise.description.length > 100
                        ? `${exercise.description.substring(0, 100)}...`
                        : exercise.description
                      : "No description available"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {pageCount > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
            >
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
