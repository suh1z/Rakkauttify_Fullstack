import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import Stats from './Stats';
import { initializeMatches, initializeMatch } from '../reducers/statsReducer';

const SimpleTable = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [filterText, setFilterText] = useState('');

  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.matches);
  const selectedMatch = useSelector((state) => state.stats.match); // Access selected match from state

  useEffect(() => {
    dispatch(initializeMatches());
  }, [dispatch]);

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const headers = Object.keys(data[0]);

  const handleRowClick = (index, match) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index);
  
    // Ensure match object is passed with matchid and url
    if (match && match.url) {
      dispatch(initializeMatch(match.matchid, match.url));  // Dispatch with matchid and url
    } else {
      console.error(`Match with ID ${match.matchid} has no URL.`);
    }
  };
  
  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );


  
  const displayHeaders = headers.filter(header => header !== 'matchid');

  return (
    <TableContainer component={Paper}>
      <TextField
        variant="outlined"
        placeholder="Search for a game..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            {displayHeaders.map((header) => (
              <TableCell key={header}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow
                onClick={() => handleRowClick(index, row)}  // Pass the entire row (match object)
                style={{ cursor: 'pointer' }}
              >
                {displayHeaders.map((header) => (
                  <TableCell key={header}>
                    {header === 'url' ? (
                      row[header].split('/').pop().split('.dem_scoreboard')[0]
                    ) : (
                      row[header] !== null ? row[header] : 'N/A'
                    )}
                  </TableCell>
                ))}
              </TableRow>
              {selectedRowIndex === index && (
                <TableRow>
                  <TableCell colSpan={displayHeaders.length}>
                    {/* Pass selected match to Stats component */}
                    {selectedMatch && <Stats match={selectedMatch} />}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimpleTable;
