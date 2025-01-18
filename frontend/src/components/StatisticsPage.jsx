import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Select, FormControl, InputLabel, TableSortLabel } from '@mui/material';
import { initializeMonths } from '../reducers/statsReducer';

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const months = useSelector((state) => state.stats.months);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nickname');

  useEffect(() => {
    dispatch(initializeMonths());  
  }, [dispatch]);

  useEffect(() => {
    if (selectedMonth) {
      const monthData = months.find((month) => month.month === selectedMonth);
      setSelectedMonthData(monthData);
    }
    if (months && months.length > 0) {
      setSelectedMonth(months[1].month);
    }
    
  }, [selectedMonth, months]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = selectedMonthData?.data?.slice().sort((a, b) => {
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
      <Typography variant="h5" style={{ marginTop: '20px' }}>Monthly Statistics</Typography>

      <FormControl fullWidth style={{ marginTop: '20px', width: '200px' }}>
        <InputLabel id="month-select-label">Select Month</InputLabel>
        <Select
          labelId="month-select-label"
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Select Month"
          style={{ width: '200px' }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
                width: 200,
              },
            },
          }}
        >
          {months.map((month) => (
            month.month !== 'players' && (
              <MenuItem key={month.month} value={month.month}>
                {month.month}
              </MenuItem>
            )
          ))}
        </Select>
      </FormControl>

      {sortedData && Array.isArray(sortedData) ? (
        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                'nickname', 
                'matchWins', 
                'matchWinPercent', 
                'matchesPlayed', 
                'roundsPlayed', 
                'damageDone', 
                'kills', 
                'deaths', 
                'hsPercent', 
                'kd', 
                'killsPerRound', 
                'entryWinPercent', 
                'rrating'
              ].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.nickname || 'Unknown'}</TableCell>
                <TableCell>{entry.matchWins || 0}</TableCell>
                <TableCell>{entry.matchWinPercent || '0.00%'}</TableCell>
                <TableCell>{entry.matchesPlayed || 0}</TableCell>
                <TableCell>{entry.roundsPlayed || 0}</TableCell>
                <TableCell>{entry.damageDone || 0}</TableCell>
                <TableCell>{entry.kills || 0}</TableCell>
                <TableCell>{entry.deaths || 0}</TableCell>
                <TableCell>{entry.hsPercent || '0.00%'}</TableCell>
                <TableCell>{entry.kd || '0.00'}</TableCell> 
                <TableCell>{entry.killsPerRound || '0.00'}</TableCell> 
                <TableCell>{entry.entryWinPercent || '0.00%'}</TableCell>
                <TableCell>{entry.rrating || '0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      ) : (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          No data available for this month.
        </Typography>
      )}
    </div>
  );
};

export default StatisticsPage;
