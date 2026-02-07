import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { initializeUser } from './reducers/userReducer';
import { initializeStats, initializePlayers } from './reducers/statsReducer';
import Navbar from './components/NavBar';

// Lazy load route components for faster initial load
const Dashboard = lazy(() => import('./components/Dashboard'));
const StatisticsPage = lazy(() => import('./components/StatisticsPage'));
const PlayerData = lazy(() => import('./components/PlayerData'));
const Pappaliiga = lazy(() => import('./components/Pappaliiga'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const RegisterPage = lazy(() => import('./components/RegisterPage'));
const MyStats = lazy(() => import('./components/MyStats'));

// CS2 themed loading spinner
const PageLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    bgcolor: '#0d0d0d'
  }}>
    <CircularProgress sx={{ color: '#de6c2c' }} />
  </Box>
);

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize core data
    dispatch(initializeStats());
    dispatch(initializeUser());
    dispatch(initializePlayers());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box sx={{ bgcolor: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/playerdata" element={<PlayerData />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/pappaliiga"
            element={user.user ? <Pappaliiga /> : <Navigate to="/login" />}
          />
          <Route
            path="/mystats"
            element={user.user ? <MyStats /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
    </Box>
  );
}

export default App;
