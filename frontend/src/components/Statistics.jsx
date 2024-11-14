import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { initializePlayerStats } from '../reducers/statsReducer';
import PlayerSelector from './PlayerSelector'; 

const Statistics = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.playerStats); 
  const players = useSelector((state) => state.stats.players); 
  const [filterText] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('Kuskinen'); 

  useEffect(() => {
    dispatch(initializePlayerStats(selectedPlayer));
  }, [dispatch, selectedPlayer]);


  const playerDetails = data?.details || {};  

  const matches = Array.isArray(playerDetails.matches) ? playerDetails.matches : [];

  if (matches.length === 0) {
    return <div>Loading or No Matches Available...</div>;
  }

  const matchColumns = [
    { field: 'date', headerName: 'Match Date', width: 150 },
    { field: 'map', headerName: 'Map', width: 100 },
    { field: 'win', headerName: 'Win', width: 80 },
    { field: 'score', headerName: 'Score', width: 80 },
    { field: 'kills', headerName: 'Kills', width: 80 },
    { field: 'deaths', headerName: 'Deaths', width: 80 },
    { field: 'assists', headerName: 'Assists', width: 80 },
    { field: 'adr', headerName: 'ADR', width: 100 },
    { field: 'damage_done', headerName: 'Damage Done', width: 120 },
    { field: 'damage_received', headerName: 'Damage Received', width: 130 },
    { field: 'clutches', headerName: 'Clutches', width: 100 },
    { field: 'mvps', headerName: 'MVPs', width: 80 },
    { field: 'team', headerName: 'Team', width: 120 },
  ];
  
  const rows = matches.map((match, index) => {
    return {
      id: index,
      date: match.date,
      map: match.map,
      win: match.win ? 'Win' : 'Loss', 
      score: match.score,
      kills: match.kills,
      deaths: match.deaths,
      assists: match.assists,
      adr: match.adr.toFixed(2), 
      damage_done: match.damage_done,
      damage_received: match.damage_received,
      clutches: match.clutch_v1_wins + match.clutch_v2_wins + match.clutch_v3_wins + match.clutch_v4_wins + match.clutch_v5_wins,
      mvps: match.mvps,
      team: match.team,
    };
  });
  
  
  const filteredPlayers = players.filter((player) =>
    player.nickname.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
        <PlayerSelector
          players={filteredPlayers}
          onPlayerSelect={setSelectedPlayer}
        />
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={matchColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    </div>
  );
};

export default Statistics;
