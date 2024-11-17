/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import CustomTable from './CustomTable';

const DetailedMatchPage = () => {
  const location = useLocation();
  const { data } = location.state || {};
  if (!data || !data.matchData) {
    return <Typography>No data available</Typography>;
  }

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kills');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columns = Object.keys(data.matchData.player_scores[0]).filter(
    (column) =>
      !['team', 'steam_id', 'team_rounds', 'team_id','avatar'].includes(column) &&
      typeof data.matchData.player_scores[0][column] !== 'object'
  );

  const rowColor = (row, index) => {
    if (row.team_id === 2) return index % 2 === 0 ? '#ffca28' : '#ffc107';
    if (row.team_id === 3) return index % 2 === 0 ? '#29b6f6' : '#03a9f4';
    return 'inherit';
  };


  return (
    <div>
      <Typography variant="h4">Detailed Match View</Typography>
      <CustomTable
        data={data.matchData.player_scores}
        columns={columns}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowColor={rowColor}
      />
      <Button variant="contained" onClick={() => window.history.back()} sx={{ marginTop: 2 }}>
        Back to Previous Page
      </Button>
    </div>
  );
};

export default DetailedMatchPage;
