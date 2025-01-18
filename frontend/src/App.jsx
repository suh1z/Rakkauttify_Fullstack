import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { initializeUser } from './reducers/userReducer'
import { initializeStats } from './reducers/statsReducer'
import Dashboard from './components/Dashboard'
import StatisticsPage from './components/StatisticsPage'
import Navbar from './components/NavBar'
import PlayerData from './components/PlayerData'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeStats())
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <Container>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Dashboard/>}
        />
        <Route
          path="/playerdata"
          element={<PlayerData />}
        />
      <Route 
        path="/statistics" 
        element={<StatisticsPage />} 
        />
      </Routes>
    </Container>
  )
}

export default App