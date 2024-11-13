/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from '@mui/material'

const DataTable = ({ data }) => {

  // Always call hooks at the top level
  const [order, setOrder] = useState('asc'); // Ascending or descending
  const [orderBy, setOrderBy] = useState('kills'); // Default column to sort by

  // If no data, return early to display "No data available" message
  if (!data || !data.matchData || data.matchData.player_scores.length === 0) {
    return <Typography>No data available</Typography>;
  }

  // Define the columns you want to display in the table
  const columns = [
    'nickname',
    'kills',
    'assists',
    'deaths',
    'damage_done',
    'adr',
    'enemy_2k',
    'enemy_3k',
    'team_rounds',
    'team'
  ]

  // Function to round numeric values
  const roundValue = (value) => {
    if (typeof value === 'number') {
      return Math.round(value); // Round to nearest integer
    }
    return value; // Leave non-numeric values unchanged
  }

  // Function to handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Function to sort data
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Comparator function for sorting
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  // Sort the player scores based on the current sorting state
  const sortedData = stableSort(data.matchData.player_scores, getComparator(order, orderBy));

  return (
    <div>

      <TableContainer component={Paper}>
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
              <TableRow key={player.steam_id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {roundValue(player[column])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
