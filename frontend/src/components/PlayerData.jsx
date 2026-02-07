import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { initializePlayerStats, initializePlayers } from '../reducers/statsReducer';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts';

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentSecondary: '#4ade80',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
};

const PlayerData = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.stats.players);
  const playerStats = useSelector((state) => state.stats.playerStats);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const matches = Array.isArray(playerStats?.details) ? [...playerStats.details] : [];

  // Sort matches by date ascending for the chart
  const matchesForChart = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));

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

  // Dynamically generate columns based on the first match data
  const columns = [];
  if (matches.length > 0) {
    const sample = matches[0];
    const keys = Object.keys(sample);

    // Prioritize specific columns order
    const priority = ['date', 'map', 'score', 'win'];
    
    // Add priority columns first
    priority.forEach(key => {
        if(keys.includes(key)) {
            columns.push({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: key === 'date' ? 180 : 100,
                type: key === 'win' ? 'boolean' : 'string',
                flex: key === 'map' ? 1 : 0
            });
        }
    });

    // Add remaining columns
    keys.forEach(key => {
        if(!priority.includes(key)) {
             columns.push({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: 110,
                type: typeof sample[key] === 'number' ? 'number' : 'string'
            });
        }
    });
  }

  const rows = matches.map((match, index) => ({
    id: index,
    ...match
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: cs2.bgCard, p: 1.5, border: `1px solid ${cs2.border}` }}>
          <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, mb: 0.5 }}>{label}</Typography>
          {payload.map((entry, i) => (
            <Typography key={i} sx={{ color: entry.color }}>{entry.name}: {entry.value}</Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: cs2.bgDark, color: cs2.textPrimary }}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 3, fontWeight: 'bold' }}>
            INDIVIDUAL TRACKING
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: cs2.textPrimary }}>
            Player Statistics
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel id="player-select-label" sx={{ color: cs2.textSecondary }}>Select Player</InputLabel>
            <Select
              labelId="player-select-label"
              value={selectedPlayer}
              onChange={handlePlayerSelect}
              label="Select Player"
              sx={{
                color: cs2.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                '& .MuiSvgIcon-root': { color: cs2.textSecondary }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }
                }
              }}
            >
              <MenuItem value="" sx={{ color: cs2.textSecondary }}>
                <em>-- Select a Player --</em>
              </MenuItem>
              {players.map((player) => (
                <MenuItem key={player.nickname} value={player.nickname} sx={{ color: cs2.textPrimary, '&:hover': { bgcolor: cs2.bgHover } }}>
                  {player.nickname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {selectedPlayer && matchesForChart.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>TREND ANALYSIS</Typography>
                  <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 2 }}>Performance Trends (Kills/Deaths)</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={matchesForChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke={cs2.border} />
                      <XAxis dataKey="date" tick={{ fill: cs2.textSecondary, fontSize: 12 }} />
                      <YAxis tick={{ fill: cs2.textSecondary }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="kills" stroke={cs2.accent} name="Kills" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="deaths" stroke={cs2.accentSecondary} name="Deaths" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {selectedPlayer && rows.length > 0 ? (
          <>
            <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600, mb: 2, display: 'block' }}>
              MATCH HISTORY
            </Typography>
            <Paper sx={{ height: 700, width: '100%', p: 1, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <DataGrid
                rows={rows}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25, page: 0 },
                  },
                  sorting: {
                    sortModel: [{ field: 'date', sort: 'desc' }],
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                sx={{
                  border: 0,
                  color: cs2.textPrimary,
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: cs2.bgHover,
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: cs2.bgDark,
                    fontWeight: 'bold',
                    color: cs2.textSecondary,
                  },
                  '& .MuiDataGrid-cell': {
                    borderColor: cs2.border,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderColor: cs2.border,
                  },
                  '& .MuiTablePagination-root': {
                    color: cs2.textSecondary,
                  },
                  '& .MuiIconButton-root': {
                    color: cs2.textSecondary,
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    color: cs2.textSecondary,
                    '& .MuiButton-root': { color: cs2.accent },
                  },
                }}
              />
            </Paper>
          </>
        ) : selectedPlayer ? (
          <Paper sx={{ p: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
            <Typography variant="body1" sx={{ color: cs2.textSecondary }}>
              No match data available for {selectedPlayer}.
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
            <Typography variant="body1" sx={{ color: cs2.textSecondary }}>
              Select a player above to view their match history.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PlayerData;
