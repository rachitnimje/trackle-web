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
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import { useSpring, animated } from '@react-spring/web';
import Cookies from 'js-cookie';

// Create animated components
const AnimatedAppBar = animated(AppBar);
const AnimatedIconButton = animated(IconButton);
const AnimatedBox = animated(Box);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  // Animations
  const appBarProps = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0%)' },
    config: { tension: 280, friction: 60 }
  });
  
  const logoProps = useSpring({
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    delay: 100,
    config: { tension: 200, friction: 20 }
  });
  
  const menuButtonProps = useSpring({
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    delay: 200,
    config: { tension: 200, friction: 20 }
  });
  
  useEffect(() => {
    // Check auth status only in client environment
    const checkAuth = () => {
      const token = Cookies.get('token');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!token);
      setUsername(storedUsername);
    };
    
    checkAuth();
  }, []);

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    router.push('/');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Workouts', icon: <DirectionsRunIcon />, path: '/workouts' },
    { text: 'Exercises', icon: <SportsGymnasticsIcon />, path: '/exercises' },
    { text: 'Templates', icon: <FormatListBulletedIcon />, path: '/templates' },
    { text: 'Statistics', icon: <BarChartIcon />, path: '/statistics' },
  ];

  const drawer = (
    <Box
      sx={{ 
        width: 280, 
        height: '100%',
        background: 'linear-gradient(180deg, #0a1929 0%, #0c223a 100%)'
      }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <Box sx={{ 
        py: 3, 
        px: 3, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        <FitnessCenterIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700} component="div" color="primary">
          Trackle
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2, opacity: 0.2 }} />
      
      {isLoggedIn && username && (
        <Box sx={{ px: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 40, 
              height: 40,
              boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member
            </Typography>
          </Box>
        </Box>
      )}
      
      <List sx={{ px: 1.5 }}>
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
    <AnimatedAppBar position="sticky" color="default" elevation={1} style={appBarProps} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {isMobileView && (isLoggedIn || isHomePage) && (
            <AnimatedIconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              style={menuButtonProps}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </AnimatedIconButton>
          )}
          
          <AnimatedBox style={logoProps} sx={{ display: 'flex', alignItems: 'center' }}>
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
          </AnimatedBox>
          
          {!isMobileView && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, flexGrow: 1 }}>
              {isLoggedIn && menuItems.map((item, index) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.path}
                  sx={{ 
                    mx: 1,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    fontWeight: pathname === item.path ? 700 : 400,
                    position: 'relative',
                    '&::after': pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      width: '30%',
                      height: '3px',
                      backgroundColor: 'primary.main',
                      borderRadius: '3px',
                      transform: 'translateX(-50%)'
                    } : {}
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ ml: 'auto' }}>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isMobileView && username && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Tooltip title="User Profile">
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          bgcolor: 'primary.main',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                      {username}
                    </Typography>
                  </Box>
                )}
                {!isMobileView && (
                  <Tooltip title="Logout">
                    <Button 
                      color="inherit" 
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{ ml: 1 }}
                    >
                      Logout
                    </Button>
                  </Tooltip>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="outlined"
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
    </AnimatedAppBar>
  );
}
