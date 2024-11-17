import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Typography, Box } from '@mui/material'
import Navbar from './components/NavBar'
import Matches from './components/Matches'
import { initializeUser } from './reducers/userReducer'
import { initializeStats } from './reducers/statsReducer'
import Statistics from './components/Statistics'
import StatsPage from './components/StatsPage'
import DetailedMatchPage from './components/DetailedMatchPage'

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
          }
        />
        <Route
          path="/playerdata"
          element={<Statistics />}
        />
        <Route
          path="/monthdata"
          element={ <StatsPage /> }
        />
        <Route
          path="/detailed-match"
          element={ <DetailedMatchPage/> }
        />
      </Routes>
    </Container>
  )
}

export default App
