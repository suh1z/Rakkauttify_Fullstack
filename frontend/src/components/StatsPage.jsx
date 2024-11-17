import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMonths } from '../reducers/statsReducer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, CircularProgress, IconButton } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

const MonthSelector = () => {
  const dispatch = useDispatch();
  const months = useSelector((state) => state.stats.months);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: 'nickname',
    direction: 'asc',
  });

  useEffect(() => {
    dispatch(initializeMonths());
  }, [dispatch]);

  useEffect(() => {
    if (months.length > 0) {
        const sortedMonths = [...months].sort((a, b) => new Date(b.month) - new Date(a.month));
        setSelectedMonth(sortedMonths[0].month);      
        setFilteredData(months[0].data);
        setLoading(false);
    }
  }, [months]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    const monthData = months.find((monthData) => monthData.month === month);
    if (monthData) {
      setFilteredData(monthData.data);
    }
  };

  const calculateKD = (kills, deaths) => {
    return deaths === 0 ? (kills).toFixed(2) : ((kills) / deaths).toFixed(2);
  };

  const calculateHSPercent = (headshotKills, kills) => {
    return kills > 0 ? Math.round((headshotKills / kills) * 100) : 0;
  };

  const calculateKR = (kills, roundsPlayed) => {
    return roundsPlayed > 0 ? (kills / roundsPlayed).toFixed(2) : 0;
  };

  const calculateClutches = (clutchData) => {
    // Summing all clutch counts (from clutch_v1_count to clutch_v5_count)
    return clutchData.clutch_v1_count + clutchData.clutch_v2_count + clutchData.clutch_v3_count + clutchData.clutch_v4_count + clutchData.clutch_v5_count;
  };

  const calculateEntryWinPercent = (entryCount, entryWins) => {
    return entryCount > 0 ? ((entryWins / entryCount) * 100).toFixed(2) : 0;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    const sortedData = [...filteredData].sort((a, b) => {
      let valueA, valueB;
  
      // Handle calculated columns separately
      if (key === 'kda') {
        valueA = parseFloat(calculateKD(a.kills, a.deaths));  // Ensure numeric value
        valueB = parseFloat(calculateKD(b.kills, b.deaths));  // Ensure numeric value
      } else if (key === 'hs_percent') {
        valueA = parseFloat(calculateHSPercent(a.headshot_kills, a.kills)); // Ensure numeric value
        valueB = parseFloat(calculateHSPercent(b.headshot_kills, b.kills)); // Ensure numeric value
      } else if (key === 'kr') {
        valueA = parseFloat(calculateKR(a.kills, a.rounds_played)); // Ensure numeric value
        valueB = parseFloat(calculateKR(b.kills, b.rounds_played)); // Ensure numeric value
      } else if (key === 'entry_win_percent') {
        valueA = parseFloat(calculateEntryWinPercent(a.entry_count, a.entry_wins)); // Ensure numeric value
        valueB = parseFloat(calculateEntryWinPercent(b.entry_count, b.entry_wins)); // Ensure numeric value
      } else if (key === 'total_clutches') {
        valueA = parseFloat(calculateClutches(a)); // Ensure numeric value
        valueB = parseFloat(calculateClutches(b)); // Ensure numeric value
      } else {
        // For normal numbers (non-calculated), ensure they're treated as float
        valueA = parseFloat(a[key]);
        valueB = parseFloat(b[key]);
      }
  
      // Comparison logic
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  
    setSortConfig({ key, direction });
    setFilteredData(sortedData);
  };
  

  const matchColumns = [
    { field: 'nickname', headerName: 'Nickname', width: 150 },
    { field: 'match_wins', headerName: 'Match Wins', width: 100 },
    { field: 'matches_played', headerName: 'Matches Played', width: 150 },
    { field: 'rounds_played', headerName: 'Rounds Played', width: 150 },
    { field: 'kills', headerName: 'Kills', width: 80 },
    { field: 'deaths', headerName: 'Deaths', width: 80 },
    { field: 'assists', headerName: 'Assists', width: 80 },
    { field: 'kda', headerName: 'KD', width: 100 },
    { field: 'hs_percent', headerName: 'HS %', width: 100 },
    { field: 'kr', headerName: 'K/R', width: 100 },
    { field: 'total_clutches', headerName: 'Total Clutches', width: 100 },
    { field: 'entry_win_percent', headerName: 'Entry Win %', width: 100 },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <FormControl>
        <InputLabel>Month</InputLabel>
        <Select
          value={selectedMonth}
          label="Month"
          onChange={handleMonthChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
                width: 'auto',
              },
            },
          }}
        >
          {[...months]
            .sort((a, b) => new Date(b.month) - new Date(a.month))
            .map((month) => (
              <MenuItem key={month.month} value={month.month}>
                {month.month}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {matchColumns.map((column) => (
                <TableCell key={column.field} sortDirection={sortConfig.key === column.field ? sortConfig.direction : false}>
                  <span>{column.headerName}</span>
                  <IconButton onClick={() => handleSort(column.field)} size="small">
                    {sortConfig.key === column.field && sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={matchColumns.length}>No data available for the selected month.</TableCell>
              </TableRow>
            ) : (
              filteredData.map((match, index) => (
                <TableRow key={index}>
                  <TableCell>{match.nickname}</TableCell>
                  <TableCell>{match.match_wins}</TableCell>
                  <TableCell>{match.matches_played}</TableCell>
                  <TableCell>{match.rounds_played}</TableCell>
                  <TableCell>{match.kills}</TableCell>
                  <TableCell>{match.deaths}</TableCell>
                  <TableCell>{match.assists}</TableCell>
                  <TableCell>{calculateKD(match.kills, match.deaths)}</TableCell>
                  <TableCell>{calculateHSPercent(match.headshot_kills, match.kills)}%</TableCell>
                  <TableCell>{calculateKR(match.kills, match.rounds_played)}</TableCell>
                  <TableCell>{calculateClutches(match)}</TableCell>
                  <TableCell>{calculateEntryWinPercent(match.entry_count, match.entry_wins)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MonthSelector;
