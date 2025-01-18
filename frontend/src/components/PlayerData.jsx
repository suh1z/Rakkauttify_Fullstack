import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel
} from '@mui/material';
import { initializePlayerStats, initializePlayers } from '../reducers/statsReducer';

const PlayerData = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.stats.players);
  const playerStats = useSelector((state) => state.stats.playerStats);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');

  const matches = Array.isArray(playerStats?.details) ? playerStats.details : [];

  useEffect(() => {
    dispatch(initializePlayers());
  }, []);

  const handlePlayerSelect = (event) => {
    const nickname = event.target.value;
    setSelectedPlayer(nickname);
    if (nickname) {
      dispatch(initializePlayerStats(nickname));
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (b[orderBy] < a[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Player Statistics
      </Typography>

      <FormControl fullWidth style={{ marginBottom: '20px', maxWidth: '300px' }}>
        <InputLabel id="player-select-label">Select Player</InputLabel>
        <Select
          labelId="player-select-label"
          value={selectedPlayer}
          onChange={handlePlayerSelect}
          label="Select Player"
        >
          <MenuItem value="">
            <em>-- Select a Player --</em>
          </MenuItem>
          {players.map((player) => (
            <MenuItem key={player.nickname} value={player.nickname}>
              {player.nickname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedPlayer && sortedMatches.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(sortedMatches[0]).map((column) => (
                  ![''].includes(column) && (
                    <TableCell key={column}>
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : 'asc'}
                        onClick={() => handleRequestSort(column)}
                      >
                        {column}
                      </TableSortLabel>
                    </TableCell>
                  )
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMatches.map((match, index) => (
                <TableRow key={index} hover>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.map}</TableCell>
                  <TableCell>{match.score}</TableCell>
                  {Object.keys(match).map((column) => (
                    !['date', 'map', 'score'].includes(column) && (
                      <TableCell key={column}>
                        {column === 'win' ? (match[column] ? 'Yes' : 'No') : match[column]}
                      </TableCell>
                    )
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : selectedPlayer ? (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          No match data available for {selectedPlayer}.
        </Typography>
      ) : (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Select a player to view their stats.
        </Typography>
      )}
    </div>
  );
};

export default PlayerData;
