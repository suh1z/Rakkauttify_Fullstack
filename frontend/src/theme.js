import { createTheme } from '@mui/material/styles'
import { grey, orange } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: grey[500],
    },
    secondary: {
      main: grey[700],
    },
    text: {
      primary: grey[50],
      secondary: grey[300],
    },
    grey: {
      400: grey[400],
      600: grey[600],
      700: grey[700],
      800: grey[800],
    },
    link: {
      main: orange[100],
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            fontSize: '0.875rem',
            padding: '4px',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: '1rem',
            padding: '4px',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          padding: '8px',
          borderRadius: '4px',
          width: '100%',
          overflowX: 'auto',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: grey[50],
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: grey[800],

            fontSize: '0.875rem',
            padding: '0 8px',
            height: '40px',
            width: '200px',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 650,
          backgroundColor: '#121212',
          width: '100%',
          tableLayout: 'auto',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '4px 6px',
          borderBottom: `1px solid ${grey[600]}`,
        },
        head: {
          backgroundColor: grey[700],
          color: grey[50],
          fontWeight: 'bold',
        },
        body: {
          color: grey[50],
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          '&:hover': { backgroundColor: grey[600] },
          width: '100%',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          backgroundColor: '#333',
          width: '100%',
          borderRadius: '0 0 16px 16px',
          overflowX: 'auto',
        },
        link: {
          main: orange[100],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#333',
          width: '100%',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: orange[50],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFC107',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#FFC107',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          color: orange[50],
        },
        h1: {
          color: orange[100],
        },
        h6: {
          color: orange[200],
        },
      },
    },
  },
})

export default theme
