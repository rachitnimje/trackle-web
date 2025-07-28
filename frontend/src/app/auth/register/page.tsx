'use client';

import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  Link as MuiLink, 
  Paper, 
  InputAdornment, 
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register, login } from '../../../api/auth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await register(email, password, username);
      
      if (response.success) {
        // Registration successful - now we need to login the user
        try {
          const loginResponse = await login(email, password);
          if (loginResponse.success && loginResponse.data && loginResponse.data.token) {
            document.cookie = `token=${loginResponse.data.token}; path=/;`;
            
            // Store username in localStorage for displaying in the UI
            localStorage.setItem('username', username);
            
            router.push('/workouts');
          } else {
            // Registration was successful but login failed
            setError('Account created successfully. Please log in.');
            setTimeout(() => {
              router.push('/auth/login');
            }, 2000);
          }
        } catch (loginErr: any) {
          // Registration was successful but login failed
          console.error('Login after registration error:', loginErr);
          setError('Account created successfully. Please log in.');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            Create Account
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" mb={3}>
            Join Trackle and start your fitness journey
          </Typography>
        </motion.div>
        
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
              label="Username" 
              margin="normal" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
          
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
                        onClick={() => setShowPassword(!showPassword)}
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
            <TextField 
              fullWidth 
              label="Confirm Password" 
              margin="normal" 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VerifiedUserIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showConfirmPassword ? "Hide password" : "Show password"}>
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                'Create Account'
              )}
            </Button>
          </motion.div>
          {/* We've already moved the error alert to the top */}
        </Box>
        <Typography mt={3} align="center" color="text.secondary">
          Already have an account?{' '}
          <MuiLink 
            component={Link} 
            href="/auth/login" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Login
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
