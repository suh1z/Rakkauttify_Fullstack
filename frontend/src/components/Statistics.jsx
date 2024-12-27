import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { initializePlayerStats } from '../reducers/statsReducer';
import PlayerSelector from './PlayerSelector';

const Statistics = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.playerStats);
  const players = useSelector((state) => state.stats.players);
  const [filterText] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('Kuskinen');
  const [sortModel, setSortModel] = useState([
    { field: 'date', sort: 'desc' },
  ]);

  useEffect(() => {
    dispatch(initializePlayerStats(selectedPlayer));
  }, [dispatch, selectedPlayer]);

  const matches = useMemo(() => {
    return Array.isArray(data?.details?.matches) ? data.details.matches : [];
  }, [data]);

  const allWeapons = useMemo(() => {
    const weaponsSet = new Set();
    matches.forEach((match) => {
      Object.keys(match.kills_by_weapon || {}).forEach((weapon) => weaponsSet.add(weapon));
      Object.keys(match.deaths_by_weapon || {}).forEach((weapon) => weaponsSet.add(weapon));
    });
    return [...weaponsSet];
  }, [matches]);

  const columns = useMemo(() => {
    const weaponColumns = allWeapons.flatMap((weapon) => [
      { field: `${weapon}_kills`, headerName: `${weapon} Kills`, width: 120 },
      { field: `${weapon}_deaths`, headerName: `${weapon} Deaths`, width: 120 },
    ]);

    const additionalFields = [
      'smoke_kills', 'smoke_deaths', 'team_smoke_kills', 'team_smoke_deaths',
      'blind_kills', 'blind_deaths', 'team_blind_kills', 'team_blind_deaths',
      'flash_assists', 'flash_kills', 'flash_deaths', 'team_flash_assists',
      'team_flash_kills', 'team_flash_deaths', 'no_scope_kills', 'no_scope_deaths',
      'team_no_scope_kills', 'team_no_scope_deaths', 'wallbang_kills', 'wallbang_deaths',
      'team_wallbang_kills', 'team_wallbang_deaths', 'suicides', 'reloads', 'shots_fired',
      'shots_on_enemies', 'shots_on_teammates', 'enemy_2k', 'enemy_3k', 'enemy_4k',
      'enemy_5k', 'entry_count', 'entry_wins', 'clutch_v1_count', 'clutch_v1_wins',
    ];

    const additionalColumns = additionalFields.map((field) => ({
      field,
      headerName: field.replace(/_/g, ' ').toLowerCase(),
      width: 120,
    }));

    const generalColumns = [
      { field: 'date', headerName: 'Match Date', width: 150 },
      { field: 'map', headerName: 'Map', width: 100 },
      { field: 'win', headerName: 'Win', width: 80 },
      { field: 'score', headerName: 'Score', width: 80 },
      { field: 'kills', headerName: 'Kills', width: 80 },
      { field: 'deaths', headerName: 'Deaths', width: 80 },
      { field: 'adr', headerName: 'ADR', width: 100 },
      { field: 'headshot_kills', headerName: 'HS Kills', width: 100 },
      { field: 'headshot_deaths', headerName: 'HS Deaths', width: 100 },
    ];

    return [...generalColumns, ...weaponColumns, ...additionalColumns];
  }, [allWeapons]);

  const rows = useMemo(() => {
    return matches.map((match, index) => {
      const weaponStats = allWeapons.reduce((acc, weapon) => {
        acc[`${weapon}_kills`] = match.kills_by_weapon?.[weapon] ?? 0;
        acc[`${weapon}_deaths`] = match.deaths_by_weapon?.[weapon] ?? 0;
        return acc;
      }, {});
  
      const generalStats = {
        id: index,
        date: match.date || 'N/A',
        map: match.map || 'Unknown',
        win: match.win ? 'Win' : 'Loss',
        score: match.score || 0,
        kills: match.kills || 0,
        deaths: match.deaths || 0,
        adr: match.adr !== undefined ? Math.round(match.adr) : 0,
        headshot_kills: match.headshot_kills || 0,
        headshot_deaths: match.headshot_deaths || 0,
      };
  
      const dynamicStats = columns.reduce((acc, column) => {
        const field = column.field;
        if (!(field in generalStats) && !(field in weaponStats)) {
          acc[field] = match[field] ?? 0;
        }
        return acc;
      }, {});
  
      return {
        ...generalStats,
        ...weaponStats,
        ...dynamicStats,
      };
    });
  }, [matches, allWeapons, columns]);
  

  if (matches.length === 0) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div style={{ label: 'Player', display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
        <PlayerSelector
          players={players.filter((player) =>
            player.nickname.toLowerCase().includes(filterText.toLowerCase())
          )}
          onPlayerSelect={setSelectedPlayer}
        />
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

export default Statistics;
