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
import { logoutUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'

const Navbar = (props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState(null)
  const dispatch = useDispatch()

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
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
                <Link to="/" className="link">
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/statistics" className="link">
                  Statistics
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/summarize" className="link">
                  Summarize
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/inhouse" className="link">
                  Inhouse
                </Link>
              </MenuItem>
              {props.user && (
                <MenuItem onClick={handleLogout}>
                  <Link to="/" className="link">
                    Logout
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', ml: 'auto' }}>
              <Link to="/" className="link">
                Rakkauttify
              </Link>
              <Link to="/statistics" className="link">
                Statistics
              </Link>
              <Link to="/summarize" className="link">
                Summarize
              </Link>
              <Link to="/inhouse" className="link">
                Inhouse
              </Link>
              {props.user && (
                <Link to="/" onClick={handleLogout} className="link">
                  Logout
                </Link>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexGrow: 8 }}></Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
export default Navbar
