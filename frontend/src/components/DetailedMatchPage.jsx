import { useLocation } from 'react-router-dom';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Button } from '@mui/material';
import { useState } from 'react';

const DetailedMatchPage = () => {
  const location = useLocation();
  const { data } = location.state || {}; 

  if (!data || !data.matchData) {
    return <Typography>No data available</Typography>;
  }

  const team_1 = data.matchData.player_scores.find(record => record.team_id === 2);
  const team_2 = data.matchData.player_scores.find(record => record.team_id === 3);

  const columns = data.matchData.player_scores.length > 0 ? Object.keys(data.matchData.player_scores[0]) : [];
  const filteredColumns = columns.filter((column) => column !== 'team' && column !== 'steam_id' && column !== 'team_rounds' && column !== 'team_id');

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kills');

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
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const sortedData = stableSort(data.matchData.player_scores, getComparator(order, orderBy));

  const teamColors = {
    team_1: '#87ceeb',  // Light blue for Team 1
    team_2: '#ffa07a'   // Light salmon for Team 2
  };

  const renderCellValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([weapon, count]) => `${weapon}: ${count}`)
        .join(', ');
    }
    return value;
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Detailed Match View
      </Typography>

      <Typography variant="h6" sx={{ color: team_1 ? teamColors.team_1 : 'inherit' }}>
        Team 1: {team_1 ? team_1.team : 'N/A'} ({team_1 ? team_1.team_rounds : 'N/A'} rounds)
      </Typography>

      <Typography variant="h6" sx={{ color: team_2 ? teamColors.team_2 : 'inherit' }}>
        Team 2: {team_2 ? team_2.team : 'N/A'} ({team_2 ? team_2.team_rounds : 'N/A'} rounds)
      </Typography>

      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {filteredColumns.map((column) => (
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
              <TableRow key={player.steam_id}
              style={{
                backgroundColor: player.team_id === 2 ? '#87ceeb' : player.team_id === 3 ? '#ffa07a' : 'inherit'}}>
                {filteredColumns.map((column) => (
                  <TableCell key={column}>
                    {renderCellValue(player[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => window.history.back()}>
        Back to Previous Page
      </Button>
    </Paper>
  );
};

export default DetailedMatchPage;
