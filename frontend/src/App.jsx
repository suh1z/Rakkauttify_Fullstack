import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { initializeCards } from './reducers/cardReducer'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Typography, Box } from '@mui/material'
import CardCarousel from './components/CarouselCards'
import Navbar from './components/NavBar'
import Matches from './components/Matches'
import Inhouse from './components/Inhouse'
import LoginForm from './components/LoginForm'
import Statistics from './components/Statistics'
import { initializeUser } from './reducers/userReducer'

function App() {
  const dispatch = useDispatch()
  const cards = useSelector((state) => state.cards)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeCards())
    dispatch(initializeUser())
  }, [dispatch])

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
                  }}
                >
                  <Typography variant="h6" align="center">
                    Most recent games
                  </Typography>
                </Box>

                <CardCarousel cardsData={cards} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/matches"
          element={
            user.user ? <Matches data={cards} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/statistics"
          element={user.user ? <Statistics /> : <Navigate to="/statistics" />}
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
