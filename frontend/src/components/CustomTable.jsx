/* eslint-disable react/prop-types */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';

const CustomTable = ({ data, columns, order, orderBy, onRequestSort, rowColor }) => {
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
      const teamComparison = a.team_id - b.team_id;
      if (teamComparison !== 0) return teamComparison;

      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : a[orderBy] > b[orderBy] ? -1 : 0;
      }
    };
  };

  const sortedData = stableSort(data, getComparator(order, orderBy));

  const getMaxValueForColumn = (column) => {
    const values = data.map((row) => row[column]);
    return Math.max(...values);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column}
                sortDirection={orderBy === column ? order : false}
                style={{ borderBottom: 'none' }} 
              >
                <TableSortLabel
                  active={orderBy === column}
                  direction={orderBy === column ? order : 'asc'}
                  onClick={() => onRequestSort(column)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={row.steam_id || index}
              style={{
                backgroundColor: rowColor ? rowColor(row, index) : 'inherit',
                borderBottom: 'none',
              }}
            >
              {columns.map((column) => {
                const maxValue = getMaxValueForColumn(column);
                return (
                  <TableCell
                    key={column}
                    style={{
                      fontWeight: row[column] === maxValue ? 'bold' : 'normal',
                      color: 'black',
                      borderBottom: 'none',
                    }}
                  >
                    {typeof row[column] === 'number' ? Math.round(row[column]) : row[column]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
