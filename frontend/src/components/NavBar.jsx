/* eslint-disable react/prop-types */
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from 'react-router-dom'
import '../App.css'

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
    <AppBar position="sticky">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link to="/">
                  <a href="#" className="link">
                    Home
                  </a>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/statistics">
                  <a href="#" className="link">
                    Statistics
                  </a>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/graphs">
                  <a href="#" className="link">
                    Graphs
                  </a>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/inhouse">
                  <a href="#" className="link">
                    Inhouse
                  </a>
                </Link>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', ml: 'auto' }}>
              <Link to="/">
                <a href="#" className="link">
                  Rakkauttify
                </a>
              </Link>
              <Link to="/statistics">
                <a href="#" className="link">
                  Statistics
                </a>
              </Link>
              <Link to="/graphs">
                <a href="#" className="link">
                  Graphs
                </a>
              </Link>
              <Link to="/inhouse">
                <a href="#" className="link">
                  Inhouse
                </a>
              </Link>
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 8 }}></Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
export default Navbar
