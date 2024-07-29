import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

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
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: grey[400],
            },
            '&:hover fieldset': {
              borderColor: grey[600],
            },
            '&.Mui-focused fieldset': {
              borderColor: grey[800],
            },
          },
          '& .MuiInputLabel-root': {
            color: grey[300],
          },
          '& .MuiInputBase-input': {
            color: grey[50],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

export default theme
