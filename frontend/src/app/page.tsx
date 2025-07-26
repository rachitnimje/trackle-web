'use client';

import { Typography, Button, Container, Box, Paper, Stack, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimelineIcon from '@mui/icons-material/Timeline';
import CreateIcon from '@mui/icons-material/Create';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        pt: { xs: 4, md: 10 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            mb: { xs: 6, md: 10 }
          }}
        >
          <Box 
            sx={{ 
              flex: 1,
              textAlign: { xs: 'center', md: 'left' }, 
              mb: { xs: 4, md: 0 } 
            }}
          >
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              component="h1" 
              fontWeight={800} 
              gutterBottom
              sx={{ 
                color: 'text.primary',
                background: 'linear-gradient(90deg, #ff1744 0%, #ff616f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Track Your Fitness Journey
            </Typography>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '90%', mx: { xs: 'auto', md: 0 } }}
            >
              Trackle helps you monitor workouts, create reusable templates, and visualize your progress with beautiful statistics.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/auth/register" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                href="/auth/login"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <Box 
              sx={{ 
                width: '100%',
                height: { xs: '250px', md: '400px' },
                background: 'radial-gradient(circle, rgba(255,23,68,0.1) 0%, rgba(18,18,18,0) 70%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: { xs: 100, md: 180 }, color: 'primary.main', opacity: 0.8 }} />
            </Box>
          </Box>
        </Box>

        {/* Features Section */}
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          fontWeight={700} 
          sx={{ mb: 6, color: 'text.primary' }}
        >
          Key Features
        </Typography>
        
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
            mb: { xs: 6, md: 10 }
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              borderTop: '4px solid #ff1744',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <FitnessCenterIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" component="h3" fontWeight={700} textAlign="center" gutterBottom>
              Workout Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Log your exercises, sets, reps, and weights with an intuitive interface designed for quick data entry.
            </Typography>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              borderTop: '4px solid #ff1744',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CreateIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" component="h3" fontWeight={700} textAlign="center" gutterBottom>
              Custom Templates
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Create reusable workout templates that save time and help maintain consistency in your training routine.
            </Typography>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              borderTop: '4px solid #ff1744',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <TimelineIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" component="h3" fontWeight={700} textAlign="center" gutterBottom>
              Progress Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Visualize your fitness journey with detailed statistics and progress charts to stay motivated.
            </Typography>
          </Paper>
        </Box>

        {/* CTA Section */}
        <Paper 
          elevation={4} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255, 23, 68, 0.1) 0%, rgba(255, 97, 111, 0.05) 100%)',
            border: '1px solid rgba(255, 23, 68, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            Ready to start your fitness journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Join Trackle today and take control of your workouts with our powerful tracking and analytics tools.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            href="/auth/register" 
            size="large"
            sx={{ 
              px: 5, 
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            Sign Up Free
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
