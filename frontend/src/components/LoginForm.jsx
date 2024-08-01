/* eslint-disable react/prop-types */
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { loginUser, initializeUser } from '../reducers/userReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
      setError('')
    } catch (error) {
      setError('Invalid username or password')
      console.error('Login error:', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {user ? (
          <Typography variant="h4" color="primary" gutterBottom>
            Welcome, {user.username}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" color="primary" gutterBottom>
              Log in to Rakkautify
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{ width: '100%', marginBottom: '16px' }}
              >
                {error}
              </Alert>
            )}
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <TextField
                  data-testid="username"
                  label="Username"
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                  fullWidth
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <TextField
                  data-testid="password"
                  label="Password"
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                  fullWidth
                  required
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </form>
          </>
        )}
      </Box>
    </Container>
  )
}

export default LoginForm
