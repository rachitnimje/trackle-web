'use client';

import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert, Link as MuiLink, Paper, InputAdornment, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '../../../api/auth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await register(email, password, username);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
        router.push('/workouts');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          p: { xs: 3, sm: 4 }, 
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
          Create Account
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
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
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
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
