'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Create a theme instance
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d5afe', // Vibrant indigo/blue
      light: '#8187ff',
      dark: '#0031ca',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00e5ff', // Cyan
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#000000',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffab40',
    },
    success: {
      main: '#69f0ae',
    },
    background: {
      default: '#0a1929', // Deep blue-black background
      paper: '#132f4c',   // Navy blue for cards/papers
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      letterSpacing: '0.0075em',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01071em',
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02857em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 10px rgba(61, 90, 254, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(61, 90, 254, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        containedSecondary: {
          boxShadow: '0 4px 10px rgba(0, 229, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0, 229, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          '@media (max-width:600px)': {
            padding: '10px 20px',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          '@media (max-width:600px)': {
            padding: '4px 12px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '@media (max-width:600px)': {
            borderRadius: 8,
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          '@media (max-width:600px)': {
            borderRadius: 8,
          },
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
        elevation2: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '@media (max-width:600px)': {
            marginBottom: '12px',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&.Mui-focused fieldset': {
              borderColor: '#3d5afe',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: alpha('#3d5afe', 0.5),
            },
          },
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardError: {
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          border: '1px solid rgba(255, 82, 82, 0.3)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(105, 240, 174, 0.1)',
          border: '1px solid rgba(105, 240, 174, 0.3)',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 171, 64, 0.1)',
          border: '1px solid rgba(255, 171, 64, 0.3)',
        },
        standardInfo: {
          backgroundColor: 'rgba(61, 90, 254, 0.1)',
          border: '1px solid rgba(61, 90, 254, 0.3)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 25, 41, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            minHeight: '64px',
          },
          '@media (max-width: 599px)': {
            padding: '0 12px',
          },
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(61, 90, 254, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(61, 90, 254, 0.25)',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            color: '#00e5ff',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
          },
          '@media (max-width:600px)': {
            minHeight: 40,
            minWidth: 90,
            fontSize: '0.875rem',
            padding: '6px 12px',
          },
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a1929',
          backgroundImage: 'none',
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#3d5afe #132f4c',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#132f4c',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#3d5afe',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#8187ff',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3d5afe',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '0 16px',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16,
          },
          '@media (max-width:600px)': {
            padding: 16,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
        colorPrimary: {
          backgroundColor: alpha('#3d5afe', 0.2),
          color: '#8187ff',
        },
        colorSecondary: {
          backgroundColor: alpha('#00e5ff', 0.2),
          color: '#6effff',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          '@media (max-width:600px)': {
            margin: 16,
            borderRadius: 8,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Make fonts responsive
theme = responsiveFontSizes(theme);

export default theme;
