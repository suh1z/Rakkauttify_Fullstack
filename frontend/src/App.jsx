import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Typography, Box } from '@mui/material'
import Navbar from './components/NavBar'
import Matches from './components/Matches'
import Inhouse from './components/Inhouse'
import LoginForm from './components/LoginForm'
import Statistics from './components/Statistics'
import AiGenerator from './components/AiGenerator'
import { initializeUser } from './reducers/userReducer'
import { initializeStats } from './reducers/statsReducer'

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeStats())
    dispatch(initializeUser())
  }, [])

  return (
    <Container>
      <Navbar user={user.user} />
      <Routes>
        <Route
          path="/"
          element={
            user.user ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    mb: '20px',
                  }}
                >
                  <Typography variant="h6" align="left">
                    Rakkauden Kanaali Games
                  </Typography>
                </Box>
                <Matches />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/statistics"
          element={user.user ? <Statistics /> : <Navigate to="/" />}
        />
        <Route
          path="/summarize"
          element={user.user ? <AiGenerator /> : <Navigate to="/" />}
        />
        <Route
          path="/inhouse"
          element={
            user.user ? <Inhouse user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={!user.user ? <LoginForm /> : <Navigate to="/" />}
        />
      </Routes>
    </Container>
  )
}

export default App
