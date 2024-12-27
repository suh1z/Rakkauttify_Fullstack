import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMonths } from '../reducers/statsReducer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, CircularProgress, IconButton } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import Pie from './PieChart';

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
  const aggregateMapData = (data) => {
    const mapStats = {};

    data.forEach((row) => {
      const map = row.map_name || 'Unknown';
      if (!mapStats[map]) {
        mapStats[map] = { matches_played: 0, kills: 0, deaths: 0, adr: 0 };
      }
      mapStats[map].matches_played += row.matches_played || 0;
      mapStats[map].kills += row.kills || 0;
      mapStats[map].deaths += row.deaths || 0;
      mapStats[map].adr += row.adr || 0;
    });

    Object.keys(mapStats).forEach((map) => {
      if (mapStats[map].matches_played > 0) {
        mapStats[map].adr = (mapStats[map].adr / mapStats[map].matches_played).toFixed(2);
      }
    });

    return mapStats;
  };

  const mapData = aggregateMapData(filteredData);

  const processData = (data) => {
    return data.map((row) => {
      const updatedRow = {
        ...row,
        match_win_percent: calculateMatchWinPercent(row.match_wins, row.matches_played),
        kda: calculateKD(row.kills, row.deaths),
        hs_percent: calculateHSPercent(row.headshot_kills, row.kills),
        kr: calculateKR(row.kills, row.rounds_played),
        total_clutches: calculateClutches(row),
        entry_win_percent: calculateEntryWinPercent(row.entry_count, row.entry_wins),
        ud: calculateUD(row.he_damage_dealt, row.burn_damage_dealt),
        ef: calculateEF(row.enemies_full_flashed, row.enemies_half_flashed),
      };
      return updatedRow;
    });
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
  
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    const sortedData = [...filteredData].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
    
      if (!isNaN(valueA) && typeof valueA === 'string') {
        valueA = parseFloat(valueA);
      }
      if (!isNaN(valueB) && typeof valueB === 'string') {
        valueB = parseFloat(valueB);
      }
  
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return direction === 'asc'
          ? valueA - valueB  
          : valueB - valueA; 
      }
  
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)  
          : valueB.localeCompare(valueA);
      }
  
      return 0;
    });
  
    setSortConfig({ key, direction });
    setFilteredData(sortedData);
  };
  
  
  

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
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
   // <><div>
    //  <Pie playerName={selectedMonth} mapData={mapData} />
   // </div>
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
                  width: '100px',
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
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    {matchColumns.map((column) => {
                      const value = row[column.field];
                      return <TableCell key={column.field}>{value}</TableCell>;
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>//</>
  );
};

export default MonthSelector;
