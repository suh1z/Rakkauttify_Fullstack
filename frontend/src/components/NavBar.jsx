/* eslint-disable react/prop-types */
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" sx={{ mb: 4, backgroundColor: '#333' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#FFC107' }}>
            Rakkautify
          </Link>{' '}
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <MenuIcon sx={{ color: '#FFC107' }} />{' '}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ '& .MuiMenu-paper': { backgroundColor: '#333' } }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ color: '#FFC107' }}>
                <Link
                  to="/"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ color: '#FFC107' }}>
                <Link
                  to="/matches"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Matches
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ color: '#FFC107' }}>
                <Link
                  to="/inhouse"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Inhouse
                </Link>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" sx={{ color: '#FFC107' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Home
              </Link>
            </Button>
            <Button color="inherit" sx={{ color: '#FFC107' }}>
              <Link
                to="/matches"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Matches
              </Link>
            </Button>
            <Button color="inherit" sx={{ color: '#FFC107' }}>
              <Link
                to="/inhouse"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Inhouse
              </Link>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
