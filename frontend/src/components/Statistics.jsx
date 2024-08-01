/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { initializeStatistics } from '../reducers/statsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';

const Statistics = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.statistics);
  const [filterText, setFilterText] = useState('');
  const [recentGamesCount, setRecentGamesCount] = useState(30);

  useEffect(() => {
    dispatch(initializeStatistics(recentGamesCount));
  }, [recentGamesCount, dispatch]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const columns = Object.keys(Object.values(data)[0] || {}).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1),
    width: 90,
  }));

  const rows = Object.keys(data).map((key, index) => ({
    id: index,
    ...Object.values(data[key]).reduce((acc, value, idx) => {
      acc[columns[idx].field] = value;
      return acc;
    }, {}),
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div>
      <div >
        <TextField
          variant="outlined"
          placeholder="Search by player name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <TextField
          variant="outlined"
          type="number"
          label="Number of Recent Games"
          value={recentGamesCount}
          onChange={(e) => setRecentGamesCount(parseInt(e.target.value, 10))}
        />
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    </div>
  );
};

export default Statistics;
