/* eslint-disable react/prop-types */
// DataTablePage.js
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DataTablePage = ({ data }) => {
  const [order, setOrder] = useState('asc'); 
  const [orderBy, setOrderBy] = useState('team_id'); 

  if (!data || !data.matchData || data.matchData.player_scores.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const columns = ['nickname', 'kills', 'deaths', 'assists', 'KDA', 'HS%', 'UD' , 'ADR','damage', '2K', '3K', ];


  const roundValue = (value) => (typeof value === 'number' ? Math.round(value) : value);

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
    return (a, b) => {
      if (orderBy === 'team_id') {
        const teamComparison = a.team_id - b.team_id;
        if (teamComparison !== 0) return teamComparison;
      }
  
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : a[orderBy] > b[orderBy] ? -1 : 0;
      }
    };
  };
  

  const sortedData = stableSort(data.matchData.player_scores, getComparator(order, orderBy));

  const teamScores = Array.isArray(data.matchData.player_scores)
    ? data.matchData.player_scores.reduce(
        (teams, player) => {
          teams[player.team_id].team = player.team_name || `Team ${player.team}`;
          teams[player.team_id].rounds = player.team_rounds;
          return teams;
        },
        { 2: {}, 3: {} }
      )
    : {};

  return (
    <div>
      <TableContainer component={Paper}>
        <Typography
          variant="h6"
          sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ color: '#87ceeb', marginRight: '16px' }}>
              {teamScores[2].team} {teamScores[2].rounds}
            </div>
            <div style={{ marginRight: '16px' }}>VS</div>
            <div style={{ color: '#ffa07a' }}>
              {teamScores[3].team} {teamScores[3].rounds}
            </div>
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

