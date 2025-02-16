import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { initializeUser } from './reducers/userReducer';
import { initializeStats } from './reducers/statsReducer';
import Dashboard from './components/Dashboard';
import StatisticsPage from './components/StatisticsPage';
import Navbar from './components/NavBar';
import PlayerData from './components/PlayerData';
import Pappaliiga from './components/Pappaliiga';
import LoginPage from './components/LoginPage';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(initializeStats());
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <Container>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/playerdata" element={<PlayerData />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/pappaliiga"
          element={user.user ? <Pappaliiga /> : <Navigate to="/login" />}
        />
      </Routes>
    </Container>
  );
}

export default App;
