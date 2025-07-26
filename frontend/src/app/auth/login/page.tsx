'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink, InputAdornment, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../../api/auth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
        router.push('/workouts');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%',
          mx: 2,
          borderTop: '4px solid #ff1744',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" mb={3} fontWeight={700} align="center" color="text.primary">
          Login to Trackle
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3, mb: 2, py: 1.5 }} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
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
