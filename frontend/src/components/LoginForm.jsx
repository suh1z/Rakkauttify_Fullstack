import { Button, Typography, Container, Box, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getDiscord } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'

function generateRandomString() {
  let randomString = ''
  const randomNumber = Math.floor(Math.random() * 10)

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
  }

  return randomString
}

const generateLoginUrl = () => {
  const randomString = generateRandomString()
  localStorage.setItem('oauth-state', randomString)
  const linker =
    'https://discord.com/oauth2/authorize?client_id=1269431235101327482&response_type=code&redirect_uri=https%3A%2F%2Frakkauttify-fullstack.onrender.com%2Fapi%2Flogin&scope=identify'
  return `${linker}&state=${btoa(randomString)}`
}

const LoginForm = () => {
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const state = urlParams.get('state')
    const accessToken = urlParams.get('accessToken')
    const tokenType = urlParams.get('tokenType')

    if (accessToken && tokenType && state) {
      const storedState = localStorage.getItem('oauth-state')
      if (state !== btoa(storedState)) {
        setError('Invalid state parameter.')
        return
      }

      axios
        .get('https://discord.com/api/v10/users/@me', {
          headers: {
            authorization: `${tokenType} ${accessToken}`,
          },
        })
        .then((response) => {
          const { username, id } = response.data

          if (username && id) {
            const loggedDiscordUser = {
              user: username,
              id,
              token: accessToken,
            }

            localStorage.setItem(
              'loggedDiscordUser',
              JSON.stringify(loggedDiscordUser)
            )
            dispatch(getDiscord(loggedDiscordUser))
            localStorage.removeItem('oauth-state')
            navigate('/', { replace: true })
            window.location.reload()
          } else {
            setError('User data is missing.')
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
          setError('Failed to fetch user data.')
        })
    } else {
      setError('Access token, token type, or state parameter is missing.')
    }
  }, [dispatch, navigate])

  const handleClick = (event) => {
    event.preventDefault()
    const loginUrl = generateLoginUrl()
    window.location.href = loginUrl
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleClick}
            >
              Login with Discord
            </Button>
          </>
        )}
      </Box>
    </Container>
  )
}

export default LoginForm
