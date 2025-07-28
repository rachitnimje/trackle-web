'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, LinearProgress } from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import theme from '../theme';
import Header from '../components/Header';

// Page transition variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter() as AppRouterInstance;
  const pathname = usePathname();
  
  // Track navigation state for loading indicator
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, [router]);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render the UI after the component has mounted on the client
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}></div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && (
        <LinearProgress 
          color="primary" 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 9999,
            height: 3
          }} 
        />
      )}
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageVariants}
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          <Box 
            component="main" 
            sx={{ 
              minHeight: 'calc(100vh - 64px)',
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.025) 2%, transparent 0%)',
              backgroundSize: '100px 100px',
              pb: 6
            }}
          >
            {children}
          </Box>
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}
