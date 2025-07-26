'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a theme instance
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff1744', // Vibrant red
      light: '#ff616f',
      dark: '#c4001d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#212121', // Dark gray
      light: '#484848',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff5252',
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',   // Slightly lighter for cards/papers
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
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
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 10px rgba(255, 23, 68, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(255, 23, 68, 0.4)',
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
          '@media (max-width:600px)': {
            borderRadius: 8,
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
            '&.Mui-focused fieldset': {
              borderColor: '#ff1744',
              borderWidth: 2,
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
          backgroundColor: 'rgba(255, 23, 68, 0.1)',
          border: '1px solid rgba(255, 23, 68, 0.3)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
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
            backgroundColor: 'rgba(255, 23, 68, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255, 23, 68, 0.25)',
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
          backgroundColor: '#1a1a1a',
          backgroundImage: 'none',
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#555 #212121',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e1e1e',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#555',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#777',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff1744',
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
