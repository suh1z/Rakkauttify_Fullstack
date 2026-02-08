import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
} from '@mui/material'
import { PersonAdd as RegisterIcon, SportsEsports as GameIcon } from '@mui/icons-material'
import userService from '../services/userService'
import { initializePlayers } from '../reducers/statsReducer'

// CS2 Color Palette
const cs2Colors = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  accent: '#de6c2c',
  accentHover: '#ff7c3c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
  red: '#ef4444',
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Get players from Redux store
  const players = useSelector((state) => state.stats.players)

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch players on mount
  useEffect(() => {
    dispatch(initializePlayers())
  }, [dispatch])

  // Handle player selection from dropdown
  const handlePlayerSelect = (event, newValue) => {
    if (newValue) {
      setUsername(newValue.nickname)
      // Auto-fill display name if empty
      if (!name) {
        setName(newValue.nickname)
      }
    } else {
      setUsername('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!username || !name || !password || !inviteCode) {
      setError('All fields are required')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check password strength
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter')
      return
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter')
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number')
      return
    }

    setLoading(true)

    try {
      await userService.createUser({
        username,
        name,
        password,
        inviteCode,
      })
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: cs2Colors.bgDark,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
    }}>
      <Paper sx={{
        bgcolor: cs2Colors.bgCard,
        border: `1px solid ${cs2Colors.border}`,
        borderRadius: 2,
        p: 4,
        maxWidth: 400,
        width: '100%',
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <RegisterIcon sx={{ fontSize: 48, color: cs2Colors.accent, mb: 1 }} />
          <Typography variant="h4" sx={{ color: cs2Colors.textPrimary, fontWeight: 700 }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: cs2Colors.textSecondary, mt: 1 }}>
            Select your inhouse nickname to register
          </Typography>
          <Chip 
            icon={<GameIcon sx={{ color: cs2Colors.accent }} />}
            label="Must have played at least 1 match"
            size="small"
            sx={{ 
              mt: 1, 
              bgcolor: `${cs2Colors.accent}15`, 
              color: cs2Colors.accent,
              borderColor: cs2Colors.accent,
              '& .MuiChip-icon': { color: cs2Colors.accent }
            }}
            variant="outlined"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', color: cs2Colors.red }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(74,222,128,0.1)', color: cs2Colors.green }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: cs2Colors.textPrimary,
                '& fieldset': { borderColor: cs2Colors.border },
                '&:hover fieldset': { borderColor: cs2Colors.accent },
                '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
              },
              '& .MuiInputLabel-root': { color: cs2Colors.textSecondary },
              '& .MuiInputLabel-root.Mui-focused': { color: cs2Colors.accent },
            }}
            required
          />

          <Autocomplete
            fullWidth
            options={players || []}
            getOptionLabel={(option) => option.nickname || ''}
            value={players?.find(p => p.nickname === username) || null}
            onChange={handlePlayerSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Inhouse Nickname"
                placeholder="Search your nickname..."
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: cs2Colors.textPrimary,
                    '& fieldset': { borderColor: cs2Colors.border },
                    '&:hover fieldset': { borderColor: cs2Colors.accent },
                    '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
                  },
                  '& .MuiInputLabel-root': { color: cs2Colors.textSecondary },
                  '& .MuiInputLabel-root.Mui-focused': { color: cs2Colors.accent },
                }}
              />
            )}
            sx={{
              mb: 2,
              '& .MuiAutocomplete-popupIndicator': { color: cs2Colors.textSecondary },
              '& .MuiAutocomplete-clearIndicator': { color: cs2Colors.textSecondary },
            }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: cs2Colors.bgCard,
                  border: `1px solid ${cs2Colors.border}`,
                  '& .MuiAutocomplete-option': {
                    color: cs2Colors.textPrimary,
                    '&:hover': { bgcolor: `${cs2Colors.accent}20` },
                    '&[aria-selected="true"]': { bgcolor: `${cs2Colors.accent}30` },
                  },
                },
              },
            }}
            noOptionsText={
              <Typography sx={{ color: cs2Colors.textSecondary }}>
                No players found (play a match first!)
              </Typography>
            }
          />

          <TextField
            fullWidth
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: cs2Colors.textPrimary,
                '& fieldset': { borderColor: cs2Colors.border },
                '&:hover fieldset': { borderColor: cs2Colors.accent },
                '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
              },
              '& .MuiInputLabel-root': { color: cs2Colors.textSecondary },
              '& .MuiInputLabel-root.Mui-focused': { color: cs2Colors.accent },
            }}
            required
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Min 8 chars, uppercase, lowercase, number"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: cs2Colors.textPrimary,
                '& fieldset': { borderColor: cs2Colors.border },
                '&:hover fieldset': { borderColor: cs2Colors.accent },
                '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
              },
              '& .MuiInputLabel-root': { color: cs2Colors.textSecondary },
              '& .MuiInputLabel-root.Mui-focused': { color: cs2Colors.accent },
              '& .MuiFormHelperText-root': { color: cs2Colors.textSecondary },
            }}
            required
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: cs2Colors.textPrimary,
                '& fieldset': { borderColor: cs2Colors.border },
                '&:hover fieldset': { borderColor: cs2Colors.accent },
                '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
              },
              '& .MuiInputLabel-root': { color: cs2Colors.textSecondary },
              '& .MuiInputLabel-root.Mui-focused': { color: cs2Colors.accent },
            }}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: cs2Colors.accent,
              color: '#fff',
              py: 1.5,
              fontWeight: 600,
              '&:hover': { bgcolor: cs2Colors.accentHover },
              '&.Mui-disabled': { bgcolor: cs2Colors.border, color: cs2Colors.textSecondary },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: cs2Colors.textSecondary }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: cs2Colors.accent, textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default RegisterPage
