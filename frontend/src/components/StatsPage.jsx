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
        setSelectedMonth(sortedMonths[0].month);      setFilteredData(months[0].data);
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
  const calculateKDA = (kills, deaths, assists) => {
    return deaths === 0 ? (kills + assists).toFixed(2) : ((kills + assists) / deaths).toFixed(2);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    const sortedData = [...filteredData].sort((a, b) => {
      if (key === 'kda') {
        const kdaA = calculateKDA(a.kills, a.deaths, a.assists);
        const kdaB = calculateKDA(b.kills, b.deaths, b.assists);
        return direction === 'asc' ? kdaA - kdaB : kdaB - kdaA;
      }
  
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
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
    { field: 'kda', headerName: 'KDA', width: 100 },
    { field: 'kills', headerName: 'Kills', width: 80 },
    { field: 'deaths', headerName: 'Deaths', width: 80 },
    { field: 'assists', headerName: 'Assists', width: 80 },
    { field: 'damage_done', headerName: 'Damage Done', width: 120 },
    { field: 'damage_received', headerName: 'Damage Received', width: 130 },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <FormControl >
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
                  <TableCell>{calculateKDA(match.kills, match.deaths, match.assists)}</TableCell>
                  <TableCell>{match.kills}</TableCell>
                  <TableCell>{match.deaths}</TableCell>
                  <TableCell>{match.assists}</TableCell>
                  <TableCell>{match.damage_done}</TableCell>
                  <TableCell>{match.damage_received}</TableCell>
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
