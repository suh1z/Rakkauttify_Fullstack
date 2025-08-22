import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button } from '@mui/material';
import { fetchTeams, fetchPlayer, fetchMatches, fetchAllMatches } from '../reducers/pappaReducer';
import TeamTable from "../components/TeamTable"; 
import TeamPlayers from "../components/TeamPlayers";
import MatchCalendar from "../components/MatchCalendar"; 
import Upcoming from "../components/Upcoming";

const Pappaliiga = () => {
  const dispatch = useDispatch();

  const { teams, loading, player, matches, allmatches = {}, error: errorPlayer } = useSelector(
    (state) => state.pappa || {}
  );

  const [selectedDivision, setSelectedDivision] = useState(17);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [playerStatsById, setPlayerStatsById] = useState({});
  const [showAllStats, setShowAllStats] = useState(false); // NEW: control visibility of full stats

  useEffect(() => {
    dispatch(fetchTeams(selectedDivision, 11));
    dispatch(fetchMatches(selectedDivision, 11));
    dispatch(fetchAllMatches(selectedDivision, 11));
  }, [dispatch, selectedDivision]);

  useEffect(() => {
    if (player && player.player_id) {
      setPlayerStatsById(prev => ({
        ...prev,
        [player.player_id]: player
      }));
    }
  }, [player]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleTeamClick = (team) => {
    team.roster.forEach(player => {
      dispatch(fetchPlayer(player.player_id));
    });
    setExpandedTeam(expandedTeam === team.name ? null : team.name);
  };

  const handleDivisionChange = (e) => {
    const newDivision = Number(e.target.value);
    setSelectedDivision(newDivision);
    setExpandedTeam(null);
    setPlayerStatsById({});
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Upcoming matches always visible */}
      <Upcoming
        teams={teams}
        allmatches={allmatches}
        matches={matches}
        playerStatsById={playerStatsById}
        loading={loading}
      />

      {/* Button to toggle other general stats */}
      <div style={{ margin: '20px 0' }}>
        <Button variant="contained" onClick={() => setShowAllStats(!showAllStats)}>
          {showAllStats ? 'Hide General Stats' : 'Show General Stats'}
        </Button>
      </div>

      {showAllStats && (
        <>
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            General Statistics
          </Typography>

          <div className="mb-4">
            <label htmlFor="division" className="block mb-2">Select Division</label>
            <select
              id="division"
              value={selectedDivision}
              onChange={handleDivisionChange}
              className="border p-2 rounded"
            >
              <option value={2}>Division 2</option>
              <option value={6}>Division 6</option>
              <option value={17}>Division 17</option>
            </select>
          </div>

          <TeamTable 
            allmatches={allmatches} 
            sortBy={sortBy} 
            sortOrder={sortOrder} 
            handleSort={handleSort} 
          />

          <TeamPlayers
            teams={teams}
            playerStatsById={playerStatsById}
            handleTeamClick={handleTeamClick}
            expandedTeam={expandedTeam}
          />

          <MatchCalendar matches={matches} />
        </>
      )}
    </div>
  );
};

export default Pappaliiga;
