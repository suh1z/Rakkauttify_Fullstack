/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Chip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import { Link } from 'react-router-dom'
import '../App.css'

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  accent: '#de6c2c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
};

const Navbar = () => {
    // Logout handler: clear token and reload
    const handleLogout = () => {
      window.localStorage.removeItem('loggedInUser');
      window.location.reload();
    };
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState(null)
  const user = useSelector(state => state.user.user)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: cs2.bgCard, borderBottom: `1px solid ${cs2.border}` }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <img 
            src="/7edf72ad-a449-453d-8a85-aab3545e817d.jpeg" 
            alt="RK" 
            style={{ width: 32, height: 32, borderRadius: 4, marginRight: 8 }} 
          />
          <Typography variant="h6" sx={{ color: cs2.accent, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            RK
          </Typography>
        </Box>
        
        {isMobile ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              edge="end"
              aria-label="menu"
              onClick={handleMenuClick}
              sx={{ color: cs2.textPrimary }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: cs2.bgCard,
                  border: `1px solid ${cs2.border}`,
                  borderRadius: 0,
                }
              }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { bgcolor: cs2.bgDark } }}>
                <Link to="/" className="link">
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { bgcolor: cs2.bgDark } }}>
                <Link to="/playerdata" className="link">
                  Player Data
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { bgcolor: cs2.bgDark } }}>
                <Link to="/statistics" className="link">
                  Month Data
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { bgcolor: cs2.bgDark } }}>
                <Link to="/pappaliiga" className="link">
                  Scouting
                </Link>
              </MenuItem>
              {user && (
                <>
                  <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { bgcolor: cs2.bgDark } }}>
                    <Link to="/mystats" className="link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PersonIcon fontSize="small" /> My Stats
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }} sx={{ '&:hover': { bgcolor: cs2.bgDark }, color: cs2.red, fontWeight: 700 }}>
                    Logout
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" className="link">
                Home
              </Link>
              <Link to="/playerdata" className="link">
                Player Data
              </Link>
              <Link to="/statistics" className="link">
                Month Data
              </Link>
              <Link to="/pappaliiga" className="link">
                Scouting
              </Link>
              {user && (
                <Link to="/mystats" className="link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <PersonIcon fontSize="small" /> My Stats
                </Link>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {user && (
              <>
                <Chip 
                  icon={<PersonIcon sx={{ fontSize: 16 }} />}
                  label={user.username}
                  size="small"
                  sx={{ 
                    bgcolor: `${cs2.accent}20`, 
                    color: cs2.accent,
                    mr: 2,
                    '& .MuiChip-icon': { color: cs2.accent },
                  }}
                />
                <button
                  onClick={handleLogout}
                  style={{
                    background: cs2.accent,
                    color: cs2.bgDark,
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = cs2.accentHover}
                  onMouseOut={e => e.currentTarget.style.background = cs2.accent}
                >
                  Logout
                </button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
export default Navbar