'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check auth status only in client environment
    const checkAuth = () => {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);
    };
    
    // Check media query on client side only
    setIsMobile(window.matchMedia(theme.breakpoints.down('md').replace('@media ', '')).matches);
    
    // Add listener for resize
    const handleResize = () => {
      setIsMobile(window.matchMedia(theme.breakpoints.down('md').replace('@media ', '')).matches);
    };
    
    window.addEventListener('resize', handleResize);
    checkAuth();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.breakpoints]);

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Workouts', icon: <FitnessCenterIcon />, path: '/workouts' },
    { text: 'Exercises', icon: <FitnessCenterIcon />, path: '/exercises' },
    { text: 'Templates', icon: <FormatListBulletedIcon />, path: '/templates' },
    { text: 'Statistics', icon: <BarChartIcon />, path: '/statistics' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center' }}>
        <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Trackle
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* Always show home */}
        <ListItemButton 
          component={Link} 
          href="/"
          selected={pathname === '/'}
          sx={{ '&.Mui-selected': { color: 'primary.main' } }}
        >
          <ListItemIcon sx={{ color: pathname === '/' ? 'primary.main' : 'inherit' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        
        {/* Only show menu items when logged in */}
        {isLoggedIn && menuItems.slice(1).map((item) => (
          <ListItemButton 
            key={item.text} 
            component={Link} 
            href={item.path}
            selected={pathname === item.path}
            sx={{ '&.Mui-selected': { color: 'primary.main' } }}
          >
            <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        {isLoggedIn ? (
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : (
          <>
            <ListItemButton component={Link} href="/auth/login">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton component={Link} href="/auth/register">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {isMobile && (isLoggedIn || isHomePage) && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <FitnessCenterIcon sx={{ mr: 1, display: { xs: 'none', sm: 'flex' }, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700
            }}
          >
            Trackle
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isLoggedIn && menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.path}
                  sx={{ 
                    mx: 1,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    fontWeight: pathname === item.path ? 700 : 400
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ ml: 2 }}>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isMobile && (
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ ml: 2 }}
                  >
                    Logout
                  </Button>
                )}
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    ml: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </Box>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant={isHomePage ? "outlined" : "contained"}
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                {isHomePage && (
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="contained"
                    color="primary"
                  >
                    Register
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
