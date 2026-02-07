import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { fetchTeams, fetchPlayer, fetchMatches, fetchAllMatches } from '../reducers/pappaReducer';
import MapStatistics from "../components/MapStatistics"; 
import TeamPlayers from "../components/TeamPlayers";
import MatchCalendar from "../components/MatchCalendar"; 

const PappaliigaNextMatch = () => {
  const dispatch = useDispatch();

  const { teams, loading, player, matches, allmatches = {}, error: errorPlayer } = useSelector(
    (state) => state.pappa || {}
  );

  const [selectedDivision, setSelectedDivision] = useState(12);
  const [homeTeam, setHomeTeam] = useState('Rakkauden Kanaali');
  const [opponentTeam, setOpponentTeam] = useState('');
  const [nextMatch, setNextMatch] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [playerStatsById, setPlayerStatsById] = useState({});

  // Fetch teams and matches for the division
  useEffect(() => {
    dispatch(fetchTeams(selectedDivision, 12));
    dispatch(fetchMatches(selectedDivision, 12));
    dispatch(fetchAllMatches(selectedDivision, 12));
  }, [dispatch, selectedDivision]);

  // Update playerStatsById when a player is fetched
  useEffect(() => {
    if (player && player.player_id) {
      setPlayerStatsById(prev => ({
        ...prev,
        [player.player_id]: player
      }));
    }
  }, [player]);

  // Find next scheduled match when home team or matches change
  useEffect(() => {
    if (homeTeam && matches.length > 0) {
      // Filter scheduled matches involving the home team
      const scheduledMatches = matches.filter(match => 
        match.status === 'SCHEDULED' && 
        (match.faction1_name === homeTeam || match.faction2_name === homeTeam)
      );
      
      // Sort by scheduled time (earliest first)
      scheduledMatches.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
      
      if (scheduledMatches.length > 0) {
        const nextMatch = scheduledMatches[0];
        setNextMatch(nextMatch);
        
        // Determine opponent team
        const opponent = nextMatch.faction1_name === homeTeam 
          ? nextMatch.faction2_name 
          : nextMatch.faction1_name;
        setOpponentTeam(opponent);
      } else {
        setNextMatch(null);
        setOpponentTeam('');
      }
    } else {
      setNextMatch(null);
      setOpponentTeam('');
    }
  }, [homeTeam, matches]);

  const filteredTeams = teams.filter(team => 
    homeTeam && opponentTeam 
      ? team.name === opponentTeam 
      : []
  );

    const filteredSelection = teams.filter(team => 
    team.name === homeTeam || team.name === opponentTeam
    );


  const filteredMatches = matches.filter(match => {
    if (!homeTeam || !opponentTeam) return [];
    
    return (match.faction1_name === homeTeam && match.faction2_name === opponentTeam) ||
           (match.faction1_name === opponentTeam && match.faction2_name === homeTeam);
  });

  const filteredAllMatches = homeTeam && opponentTeam 
    ? {
        aggregatedResults: {
          [opponentTeam]: allmatches.aggregatedResults?.[opponentTeam] || {}
        }
      }
    : { aggregatedResults: {} };

  // Handle sorting in TeamTable
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Handle clicking a team: fetch all players in the team
  const handleTeamClick = (team) => {
    team.roster.forEach(player => {
      dispatch(fetchPlayer(player.player_id));
    });
    setExpandedTeam(expandedTeam === team.name ? null : team.name);
  };

  // Handle division change
  const handleDivisionChange = (e) => {
    const newDivision = Number(e.target.value);
    setSelectedDivision(newDivision);
    setHomeTeam('');
    setOpponentTeam('');
    setExpandedTeam(null);
    setPlayerStatsById({});
  };

  // Handle home team change
  const handleHomeTeamChange = (e) => {
    setHomeTeam(e.target.value);
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>
        Next Match Analysis
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="division-label">Division</InputLabel>
          <Select
            labelId="division-label"
            value={selectedDivision}
            onChange={handleDivisionChange}
            label="Division"
          >
            <MenuItem value={6}>Division 6</MenuItem>
            <MenuItem value={12}>Division 12</MenuItem>
            <MenuItem value={16}>Division 16</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="home-team-label">Home Team</InputLabel>
          <Select
            labelId="home-team-label"
            value={homeTeam}
            onChange={handleHomeTeamChange}
            label="Home Team"
          >
            <MenuItem value="">
              <em>Select a team</em>
            </MenuItem>
            {teams.map(team => (
              <MenuItem key={team.name} value={team.name}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

{homeTeam && nextMatch && (
  <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'white', borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Next Match Analysis
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 1, // smaller gap
          mt: 1 
        }}
      >
        {/* Home Team */}
        <Chip 
          label={homeTeam} 
          sx={{ fontWeight: 'bold', px: 1.5, py: 0.5, fontSize: '1rem' }} 
        />


        VS


        {/* Opponent Team */}
        <Chip 
          label={opponentTeam} 
          color="secondary" 
          sx={{ fontWeight: 'bold', px: 1.5, py: 0.5, fontSize: '1rem' }} 
        />

        {/* Scheduled Time */}
        <Typography variant="body2" sx={{ ml: 2, color: 'whiteAlpha.900', fontStyle: 'italic' }}>
          🕒 {new Date(nextMatch.scheduled_at).toLocaleString()}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)}


      {homeTeam && !nextMatch && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No scheduled matches found for {homeTeam}. Please select another team or check back later.
        </Alert>
      )}

      {homeTeam && opponentTeam && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Opponent Analysis: {opponentTeam}
          </Typography>

          <MapStatistics 
            allmatches={allmatches} 
          />

          <TeamPlayers
            teams={filteredSelection}
            playerStatsById={playerStatsById}
            handleTeamClick={handleTeamClick}
            expandedTeam={expandedTeam}
          />

          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            Previous Matches Between Teams
          </Typography>
          <MatchCalendar matches={filteredMatches} />
        </>
      )}

      {!homeTeam && (
        <Alert severity="info">
          Please select a home team to see the next match analysis.
        </Alert>
      )}
    </div>
  );
};

export default PappaliigaNextMatch;