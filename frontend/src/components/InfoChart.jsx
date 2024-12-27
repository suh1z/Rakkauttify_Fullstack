/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomTable from './CustomTable';

const DataTablePage = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kills');

  if (!data || !data.matchData || data.matchData.player_scores.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const columns = ['avatar', 'nickname', 'kills', 'deaths', 'assists', 'KD', 'HS%', 'UD', 'ADR', 'Faceit Elo', 'Rrating'];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const rowColor = (row, index) => {

    if (row.team_id === 2) {
      return index % 2 === 0 ? '#f4b04d' : '#ffb74d';
    }    
    
    if (row.team_id === 3) {
      return index % 2 === 0 ? '#29b6f6' : '#03a9f4'; 
    }
    
    return 'inherit';
  };
  
  const teamScores = data.matchData.player_scores.reduce((teams, player) => {
    const teamId = player.team_id;
    if (!teams[teamId]) {
      teams[teamId] = {
        team: player.team || `Team ${teamId}`,
        rounds: player.team_rounds || 0,
      };
    }
    return teams;
  }, {});

  const renderAvatar = (avatarUrl) => {
    const defaultAvatarStyle = {
      width: 40,
      height: 40,
      backgroundColor: 'black',
      borderRadius: '50%',
    };

    return avatarUrl ? (
      <img
        src={avatarUrl}
        alt="avatar"
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
    ) : (
      <div style={defaultAvatarStyle}></div>
    );
  };
  const demoUrl = data.demo_url;

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: '#039be5', marginRight: '16px' }}>
            {teamScores[2]?.team} {teamScores[2]?.rounds}
          </div>
          <div style={{ marginRight: '16px' }}>VS</div>
          <div style={{ color: '#f06292' }}>
            {teamScores[3]?.team} {teamScores[3]?.rounds}
          </div>
        </div>
        <div>
          <a href={demoUrl} download style={{ textDecoration: 'none', marginRight: '8px' }}>
            <Button variant="contained">Download Demo</Button>
          </a>
          <Link to="/detailed-match" state={{ data }} style={{ textDecoration: 'none' }}>
            <Button variant="contained">View Detailed Match Data</Button>
          </Link>
        </div>
      </Typography>

      <CustomTable
        data={data.matchData.player_scores.map((player) => ({
          ...player,
          avatar: renderAvatar(player.faceit?.avatar),
          Rrating: (parseFloat(player.rrating) || 0).toFixed(2),
                }))}
        columns={columns}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowColor={rowColor}
      />
    </div>
  );
};

export default DataTablePage;
