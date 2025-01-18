import { createTheme } from '@mui/material/styles';
import { blueGrey, amber } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',   // Slightly lighter background for paper elements
    },
    primary: {
      main: blueGrey[500], // Dark blue-grey for primary elements
    },
    secondary: {
      main: amber[600],    // Amber for secondary elements
    },
    text: {
      primary: '#ffffff',  // White text for primary text
      secondary: blueGrey[300], // Light grey text for secondary text
    },
    grey: {
      400: blueGrey[400],
      600: blueGrey[600],
      700: blueGrey[700],
      800: blueGrey[800],
    },
    link: {
      main: amber[200],    // Amber color for links
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          backgroundColor: blueGrey[800], // Darker background for AppBar
          width: '100%',
          borderRadius: '0 0 16px 16px',
          overflowX: 'auto',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: amber[500], // Amber color for buttons
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          color: amber[200], // Amber color for typography text
        },
        h1: {
          color: blueGrey[50], // Light blue-grey for h1
        },
        h6: {
          color: amber[400], // Amber color for h6
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          '&:hover': { backgroundColor: blueGrey[600] }, // Hover effect for table rows
          width: '100%',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '4px 6px', // Minimal padding for table cells
          borderBottom: "none"
          
        },
        head: {
          backgroundColor: blueGrey[700], // Dark blue-grey for table headers
          color: '#ffffff', // White text for headers
          fontWeight: 'bold',
        },
        body: {
          color: '#ffffff', // White text for table body
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: amber[500], // Amber color for icon buttons
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#ffffff', // White text input
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: blueGrey[800], // Dark background for input fields
            fontSize: '0.875rem',
            padding: '0 8px',
            height: '40px',
            width: '200px',
          },
        },
      },
    },
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
            backgroundColor: blueGrey[700], // Dark blue-grey column header background
            color: '#ffffff', // White text for column header
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          },
        },
      },
    },
  },
});

export default theme;
