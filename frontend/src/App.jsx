import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Typography, Box } from '@mui/material'
import Navbar from './components/NavBar'
import Matches from './components/Matches'
import Inhouse from './components/Inhouse'
import LoginForm from './components/LoginForm'
//import Statistics from './components/Statistics'
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
          path="/statistics"
          element={<AiGenerator />} // <Statistics /> 
        />
        <Route
          path="/summarize"
          element={ <AiGenerator /> }
        />
        <Route
          path="/inhouse"
          element={ user.user ? <Inhouse user={user} /> : <LoginForm /> }
        />
      </Routes>
    </Container>
  )
}

export default App
