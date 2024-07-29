import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { initializeCards } from './reducers/cardReducer'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import CardCarousel from './components/CarouselCards'
import Navbar from './components/NavBar'
import Matches from './components/Matches'
import Inhouse from './components/Inhouse'
import LoginForm from './components/LoginForm'
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
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            user.user ? (
              <CardCarousel cardsData={cards} />
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
          path="/inhouse"
          element={
            user.user ? <Inhouse user={user} /> : <Navigate to="/login" />
          }
        />
        {/* Public Route */}
        <Route
          path="/login"
          element={!user.user ? <LoginForm /> : <Navigate to="/" />}
        />
      </Routes>
    </Container>
  )
}

export default App
