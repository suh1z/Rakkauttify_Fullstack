import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Typography, 
  Box, 
  Container, 
  Tab, 
  Tabs, 
  Select, 
  MenuItem, 
  Paper,
  Fade,
  Grid
} from '@mui/material';
import { fetchTeams, fetchPlayer, fetchMatches, fetchAllMatches } from '../reducers/pappaReducer';
import MapStatistics from "../components/MapStatistics"; 
import TeamPlayers from "../components/TeamPlayers";
import MatchCalendar from "../components/MatchCalendar"; 
import Upcoming from "../components/Upcoming";
import PlayerAnalytics from "../components/PlayerAnalytics";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RadarIcon from '@mui/icons-material/Radar';

// CS2 Color Palette - defined outside component to prevent recreation
const cs2Colors = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentHover: '#ff7c3c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
  red: '#ef4444'
};

const Pappaliiga = () => {
  const dispatch = useDispatch();

  const { teams, loading, player, matches, allmatches = {} } = useSelector(
    (state) => state.pappa || {}
  );
  const globalPlayers = useSelector((state) => state.stats.players);

  const [selectedDivision, setSelectedDivision] = useState(12);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [playerStatsById, setPlayerStatsById] = useState({});

  useEffect(() => {
    dispatch(fetchTeams(selectedDivision, 12));
    dispatch(fetchMatches(selectedDivision, 12));
    dispatch(fetchAllMatches(selectedDivision, 12));
  }, [dispatch, selectedDivision]);

  useEffect(() => {
    if (player && player.player_id) {
      setPlayerStatsById(prev => ({
        ...prev,
        [player.player_id]: player
      }));
    }
  }, [player]);

  // Memoized callback to prevent re-renders in child components
  const handleTeamClick = useCallback((team) => {
    team.roster.forEach(p => {
      dispatch(fetchPlayer(p.player_id));
    });
    setExpandedTeam(prev => prev === team.name ? null : team.name);
  }, [dispatch]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  const handleDivisionChange = useCallback((e) => {
    setSelectedDivision(Number(e.target.value));
    setExpandedTeam(null);
    setPlayerStatsById({});
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: cs2Colors.bgDark,
      color: cs2Colors.textPrimary,
      pb: 4
    }}>
      {/* Hero Header */}
      <Paper elevation={0} sx={{ 
        background: `linear-gradient(135deg, ${cs2Colors.bgDark} 0%, ${cs2Colors.bgCard} 100%)`, 
        pt: 4, 
        pb: 2, 
        px: 3,
        borderBottom: `1px solid ${cs2Colors.border}`
      }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item>
               <Typography variant="overline" sx={{ color: cs2Colors.accent, letterSpacing: 3, fontWeight: 'bold', fontSize: '0.7rem' }}>
                  CS2 ANALYTICS
               </Typography>
               <Typography variant="h3" sx={{ fontWeight: 800, color: cs2Colors.textPrimary, letterSpacing: '-0.02em' }}>
                  Scouting Report
               </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: cs2Colors.bgCard, p: 1.5, borderRadius: 1, border: `1px solid ${cs2Colors.border}` }}>
                  <Typography variant="caption" sx={{ color: cs2Colors.textSecondary, ml: 1, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}>Division</Typography>
                  <Select
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    variant="standard"
                    disableUnderline
                    sx={{ 
                      color: cs2Colors.accent, 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      px: 2,
                      py: 0.5,
                      borderRadius: 0,
                      bgcolor: 'transparent',
                      '&:hover': { color: cs2Colors.accentHover }
                    }}
                  >
                    <MenuItem value={6}>Division 6</MenuItem>
                    <MenuItem value={12}>Division 12</MenuItem>
                    <MenuItem value={16}>Division 16</MenuItem>
                  </Select>
              </Box>
            </Grid>
          </Grid>

          {/* Navigation Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ 
              mt: 4,
              '& .MuiTab-root': { 
                color: cs2Colors.textSecondary, 
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                letterSpacing: 1,
                minHeight: 48,
                transition: 'color 0.2s',
                '&:hover': { color: cs2Colors.textPrimary }
              },
              '& .Mui-selected': { color: `${cs2Colors.accent} !important` },
              '& .MuiTabs-indicator': { backgroundColor: cs2Colors.accent, height: 2 }
            }}
          >
            <Tab icon={<DashboardIcon fontSize="small"/>} iconPosition="start" label="Head-to-Head" />
            <Tab icon={<GroupsIcon fontSize="small"/>} iconPosition="start" label="Teams & Players" />
            <Tab icon={<RadarIcon fontSize="small"/>} iconPosition="start" label="Deep Dive" />
            <Tab icon={<AnalyticsIcon fontSize="small"/>} iconPosition="start" label="Map Stats" />
            <Tab icon={<CalendarMonthIcon fontSize="small"/>} iconPosition="start" label="Schedule" />
          </Tabs>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Fade in={!loading} timeout={500}>
          <Box>
            {activeTab === 0 && (
              <Upcoming
                teams={teams}
                allmatches={allmatches}
                matches={matches}
                playerStatsById={playerStatsById}
                loading={loading}
              />
            )}

            {activeTab === 1 && (
               <TeamPlayers
                  teams={teams}
                  playerStatsById={playerStatsById}
                  handleTeamClick={handleTeamClick}
                  globalPlayers={globalPlayers}
                  expandedTeam={expandedTeam}
               />
            )}

            {activeTab === 2 && (
               <PlayerAnalytics
                  teams={teams}
                  playerStatsById={playerStatsById}
                  handleTeamClick={handleTeamClick}
               />
            )}

            {activeTab === 3 && (
               <MapStatistics allmatches={allmatches} />
            )}

            {activeTab === 4 && (
               <MatchCalendar matches={matches} />
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Pappaliiga;
