'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  Link as MuiLink, 
  InputAdornment, 
  IconButton, 
  CircularProgress,
  useTheme,
  alpha,
  Divider,
  Tooltip
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../../api/auth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await login(email, password);
      if (response.success && response.data && response.data.token) {
        document.cookie = `token=${response.data.token}; path=/;`;
        
        // Store username in localStorage for displaying in the UI
        try {
          const payload = response.data.token.split('.')[1];
          const decoded = JSON.parse(atob(payload));
          if (decoded.username) {
            localStorage.setItem('username', decoded.username);
          }
        } catch (e) {
          console.error('Error decoding token:', e);
        }
        
        router.push('/workouts');
      } else {
        setError(response.error || 'Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4
      }}
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          maxWidth: 430, 
          width: '100%',
          mx: 2,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          },
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`
        }}
        component={motion.div}
        variants={itemVariants}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            transform: 'translateY(-10px)'
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <FitnessCenterIcon sx={{ fontSize: 50, color: 'primary.main' }} />
        </Box>
        
        <motion.div variants={itemVariants}>
          <Typography variant="h4" fontWeight={700} align="center" color="text.primary" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" mb={3}>
            Sign in to continue to Trackle
          </Typography>
        </motion.div>
        
        <Box 
          component="form" 
          noValidate 
          autoComplete="off" 
          onSubmit={handleSubmit}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <TextField 
              fullWidth 
              label="Email" 
              margin="normal" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TextField 
              fullWidth 
              label="Password" 
              margin="normal" 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                position: 'relative',
                overflow: 'hidden'
              }} 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </motion.div>
          
          {/* We're already showing error at the top, no need to duplicate */}
        </Box>
        <Typography mt={3} align="center" color="text.secondary">
          Don't have an account?{' '}
          <MuiLink 
            component={Link} 
            href="/auth/register" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Register
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
