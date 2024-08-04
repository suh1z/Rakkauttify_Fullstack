/* eslint-disable react/prop-types */
import { Button, Typography, Container, Box, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getDiscord, setUser } from '../reducers/userReducer'

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
    'https://discord.com/oauth2/authorize?client_id=1269431235101327482&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3004%2Fapi%2Flogin&scope=identify'
  return `${linker}&state=${btoa(randomString)}`
}

const LoginForm = () => {
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const tokenType = params.get('token_type')
    const state = params.get('state')
    const storedState = localStorage.getItem('oauth-state')

    try {
      if (
        storedState &&
        state &&
        storedState !== atob(decodeURIComponent(state))
      ) {
        setError(
          'State parameter mismatch reload the page and retry. Possible CSRF attack.'
        )
        return
      }

      if (accessToken && tokenType) {
        fetch('https://discord.com/api/v10/users/@me', {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            const loggedDiscordUser = {
              user: userData.username,
              id: userData.id,
              token: `${tokenType} ${accessToken}`,
            }
            localStorage.setItem(
              'loggedDiscordUser',
              JSON.stringify(loggedDiscordUser)
            )
            dispatch(setUser(loggedDiscordUser))
            dispatch(getDiscord(loggedDiscordUser))
            localStorage.removeItem('oauth-state')
          })
          .catch((err) => {
            console.error('Error fetching user data:', err)
            setError('Failed to fetch user data.')
          })
      } else {
        setError('Access token missing please authenticate')
      }
    } catch {
      window.location.reload()
    }
  }, [dispatch])

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
          </>
        )}
      </Box>
    </Container>
  )
}

export default LoginForm
