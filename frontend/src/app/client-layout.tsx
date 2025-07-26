'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Header from '../components/Header';
import { Box } from '@mui/material';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render the UI after the component has mounted on the client
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}></div>;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Box>
      </ThemeProvider>
    </>
  );
}
