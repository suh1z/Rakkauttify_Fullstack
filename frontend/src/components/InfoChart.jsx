/* eslint-disable react/prop-types */
// DataTablePage.js
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DataTablePage = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kills');

  if (!data || !data.matchData || data.matchData.player_scores.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const columns = ['nickname', 'kills', 'assists', 'deaths', 'damage_done', 'adr', 'enemy_2k', 'enemy_3k'];

  const roundValue = (value) => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
    return value;
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'asc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const sortedData = stableSort(data.matchData.player_scores, getComparator(order, orderBy));
  const team_1 = Array.isArray(data.matchData.player_scores) ? data.matchData.player_scores.find(record => record.team_id === 2) : null;
  const team_2 = Array.isArray(data.matchData.player_scores) ? data.matchData.player_scores.find(record => record.team_id === 3) : null;

  return (
    <div>
      <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ color: '#87ceeb', marginRight: '16px' }}>{team_1.team} {team_1.rounds}</div>
    <div style={{ marginRight: '16px' }}>VS</div>
    <div style={{ color: '#ffa07a' }}>{team_2.team} {team_2.rounds}</div>
  </div>
    <Link to="/detailed-match" state={{ data }}>
    <Button variant="contained" sx={{ marginLeft: 2 }}>
      View Detailed Match Data
    </Button>
  </Link>
</Typography>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sortDirection={orderBy === column ? order : false}>
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
            {sortedData.map((player) => (
              <TableRow
                key={player.steam_id}
                style={{
                  backgroundColor: player.team_id === 2 ? '#87ceeb' : player.team_id === 3 ? '#ffa07a' : 'inherit',
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column}>{roundValue(player[column])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTablePage;
