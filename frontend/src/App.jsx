import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { initializeCards } from './reducers/cardReducer'
import { Routes, Route } from 'react-router-dom'

import CardCarousel from './components/CarouselCards'
import Navbar from './components/NavBar'
import Matches from './components/Matches'

import './App.css'

function App() {
  const dispatch = useDispatch()
  const cards = useSelector((state) => state.cards)

  useEffect(() => {
    dispatch(initializeCards())
  }, [dispatch])

  return (
    <Container>
      <Navbar />
      <Routes>
        <Route path="/" element={<CardCarousel cardsData={cards} />} />
        <Route path="/matches" element={<Matches data={cards} />} />
      </Routes>
    </Container>
  )
}

export default App
