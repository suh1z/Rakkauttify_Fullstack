import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMonths } from '../reducers/statsReducer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, CircularProgress, TableSortLabel } from '@mui/material';
import TopPlayers from './TopPlayers';

const MonthSelector = () => {
  const dispatch = useDispatch();
  const months = useSelector((state) => state.stats.months);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nickname');

  useEffect(() => {
    dispatch(initializeMonths());
  }, [dispatch]);

  useEffect(() => {
    if (months.length > 0) {
      const sortedMonths = [...months].sort((a, b) => new Date(b.month) - new Date(a.month));
      setSelectedMonth(sortedMonths[0].month);
      setFilteredData(processData(sortedMonths[0].data));
      setLoading(false);
    }
  }, [months]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    const monthData = months.find((monthData) => monthData.month === month);
    if (monthData) {
      setFilteredData(processData(monthData.data));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (array, comparator) => {
    const stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  };

  const comparator = (a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const processData = (data) => {
    return data.map((row) => {
      const updatedRow = {
        ...row,
        match_win_percent: parseFloat(calculateMatchWinPercent(row.match_wins, row.matches_played)),
        kda: parseFloat(calculateKD(row.kills, row.deaths)),
        hs_percent: parseFloat(calculateHSPercent(row.headshot_kills, row.kills)),
        kr: parseFloat(calculateKR(row.kills, row.rounds_played)),
        total_clutches: parseFloat(calculateClutches(row)),
        entry_win_percent: parseFloat(calculateEntryWinPercent(row.entry_count, row.entry_wins)),
        ud: parseFloat(calculateUD(row.he_damage_dealt, row.burn_damage_dealt)),
        ef: parseFloat(calculateEF(row.enemies_full_flashed, row.enemies_half_flashed)),
        rrating: parseFloat(calculateRRating(row.rrating))
      };
      return updatedRow;
    });
  };
  const calculateRRating = (rrating) => rrating.toFixed(2);
  const calculateKD = (kills, deaths) => deaths === 0 ? kills.toFixed(2) : (kills / deaths).toFixed(2);
  const calculateHSPercent = (headshotKills, kills) => kills > 0 ? Math.round((headshotKills / kills) * 100) : 0;
  const calculateKR = (kills, roundsPlayed) => roundsPlayed > 0 ? (kills / roundsPlayed).toFixed(2) : 0;
  const calculateClutches = (clutchData) => {
    const clutchCount = (field) => clutchData[field] || 0.00;

    const totalClutchCount = (
      clutchCount('clutch_v1_count') +
      clutchCount('clutch_v2_count') +
      clutchCount('clutch_v3_count') +
      clutchCount('clutch_v4_count') +
      clutchCount('clutch_v5_count')
    );

    const totalClutchWins = (
      clutchCount('clutch_v1_wins') +
      clutchCount('clutch_v2_wins') +
      clutchCount('clutch_v3_wins') +
      clutchCount('clutch_v4_wins') +
      clutchCount('clutch_v5_wins')
    );

    return totalClutchCount > 0
      ? ((totalClutchWins / totalClutchCount) * 100).toFixed(2)
      : 0.00;
  };

  const calculateEntryWinPercent = (entryCount, entryWins) => entryCount > 0 ? ((entryWins / entryCount) * 100).toFixed(2) : 0;
  const calculateUD = (he_damage_dealt, burn_damage_dealt) => he_damage_dealt + burn_damage_dealt;
  const calculateEF = (enemies_full_flashed, enemies_half_flashed) => enemies_full_flashed + enemies_half_flashed;

  const calculateMatchWinPercent = (matchWins, matchesPlayed) => {
    return matchesPlayed > 0 ? ((matchWins / matchesPlayed) * 100).toFixed(2) : 0.00;
  };

  const matchColumns = [
    { field: 'nickname', headerName: 'Nickname', width: 150 },
    { field: 'matches_played', headerName: 'Matches Played', width: 150 },
    { field: 'match_win_percent', headerName: 'Match Win %', width: 150 },
    { field: 'kills', headerName: 'Kills', width: 80 },
    { field: 'deaths', headerName: 'Deaths', width: 80 },
    { field: 'assists', headerName: 'Assists', width: 80 },
    { field: 'kda', headerName: 'KD', width: 100 },
    { field: 'hs_percent', headerName: 'HS %', width: 100 },
    { field: 'kr', headerName: 'K/R', width: 100 },
    { field: 'ud', headerName: 'UD', width: 100 },
    { field: 'ef', headerName: 'EF', width: 100 },
    { field: 'total_clutches', headerName: 'Clutch Win %', width: 100 },
    { field: 'entry_win_percent', headerName: 'Entry Win %', width: 100 },
    { field: 'rrating', headerName: 'R rating', width: 100 },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <div>
        <TopPlayers data={filteredData} metric="rrating" />
      </div>
      <div style={{ marginTop: '16px' }}>
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={handleMonthChange}
            MenuProps={{
              PaperProps: {
                style: {
                  width: 'auto',
                },
              },
            }}
          >
            {[...months]
              .filter(month => month.month !== 'players')
              .sort((a, b) => new Date(b.month) - new Date(a.month))
              .map((month) => (
                <MenuItem key={month.month} value={month.month}>
                  {month.month}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <div style={{ margin: '20px 0' }} />
        {/* Table with Sorting */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {matchColumns.map((column) => (
                  <TableCell key={column.field}>
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(filteredData, comparator).map((row, index) => (
                <TableRow key={index}>
                  {matchColumns.map((column) => (
                    <TableCell key={column.field}>{row[column.field]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default MonthSelector;
