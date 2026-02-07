import { createTheme } from '@mui/material/styles';

// CS2 Color Palette
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentHover: '#ff7c3c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
  red: '#ef4444'
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: cs2.bgDark,
      paper: cs2.bgCard,
    },
    primary: {
      main: cs2.accent,
      dark: '#b85a24',
      light: cs2.accentHover,
    },
    secondary: {
      main: cs2.green,
    },
    error: {
      main: cs2.red,
    },
    success: {
      main: cs2.green,
    },
    text: {
      primary: cs2.textPrimary,
      secondary: cs2.textSecondary,
    },
    divider: cs2.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 0, // Sharp edges for CS2 aesthetic
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: cs2.bgDark,
          scrollbarColor: `${cs2.accent} ${cs2.bgDark}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: cs2.bgDark,
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 0,
            backgroundColor: cs2.accent,
            minHeight: 24,
            border: `2px solid ${cs2.bgDark}`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: cs2.bgCard,
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${cs2.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          borderRadius: 0,
          letterSpacing: 1,
        },
        contained: {
          backgroundColor: cs2.accent,
          '&:hover': {
            backgroundColor: cs2.accentHover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${cs2.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDataGrid: {
        styleOverrides: {
            root: {
                border: 'none',
                '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${cs2.border}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: cs2.bgDark,
                    borderBottom: `1px solid ${cs2.border}`,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: 1.5,
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: cs2.bgHover,
                },
            }
        }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${cs2.border}`,
        },
        head: {
          backgroundColor: cs2.bgDark,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: 1,
          fontWeight: 600,
          color: cs2.textSecondary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: `${cs2.bgHover} !important`,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: cs2.bgCard,
          border: `1px solid ${cs2.border}`,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&.Mui-selected': {
            backgroundColor: cs2.accent,
            color: '#fff',
            '&:hover': {
              backgroundColor: cs2.accentHover,
            },
          },
        },
      },
    },
  },
});

export default theme;
