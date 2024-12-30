import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import CustomTable from './CustomTable';

const DetailedMatchPage = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kills');
  const [tablesVisibility, setTablesVisibility] = useState({
    performanceStats: true,
    damageStats: false,
    flashbangSmokeStats: false,
    ClutchStats: false,
    weaponStats: false,
  });

  if (!data || !data.matchData) {
    return <Typography>No data available</Typography>;
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const columns = {
    performanceStats: ['kills', 'assists', 'deaths', 'kast', 'ADR','HS%', 'headshot_deaths', 'mvps', 'Faceit Elo', 'Rrating'],
    damageStats: [
      'damage', 'damage_received', 'team_damage_done', 'team_damage_received',
      'UD', 'he_damage_received', 'team_he_damage_dealt', 'team_he_damage_received', 'he_self_damage', 'hes_thrown', 'burn_damage_received', 'team_burn_damage_dealt', 'team_burn_damage_received', 'burn_self_damage', 'burns_thrown'
    ],
    flashbangSmokeStats: [
      'smoke_kills', 'smoke_deaths','enemies_full_flashed', 'full_flashes_received', 'flashes_thrown', 'smokes_thrown'
    ],
    ClutchStats: [
      'entry_count', 'entry_wins', 'clutch_v1_count', 'clutch_v1_wins',
      'clutch_v2_count', 'clutch_v2_wins', 'clutch_v3_count', 'clutch_v3_wins',
      'clutch_v4_count', 'clutch_v4_wins', 'clutch_v5_count', 'clutch_v5_wins'    
    ],
    weaponStats: []
  };

  const getWeaponColumns = (data) => {
    const weaponColumns = new Set();
    data.forEach((player) => {
      Object.keys(player.kills_by_weapon).forEach((weapon) => {
        weaponColumns.add(weapon);
      });
    });
    return Array.from(weaponColumns);
  };

  const weaponColumns = getWeaponColumns(data.matchData.player_scores);
  columns.weaponStats = weaponColumns;

  const rowColor = (row, index) => {
    if (row.team_id === 2) return index % 2 === 0 ? '#f4b04d' : '#ffb74d';
    if (row.team_id === 3) return index % 2 === 0 ? '#29b6f6' : '#03a9f4';
    return 'inherit';
  };

  const transformedData = data.matchData.player_scores.map((player) => ({
    ...player,
    avatar: player.avatar ? (
      <img
        src={player.avatar}
        alt="avatar"
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
    ) : (
      <div
        style={{
          width: 40,
          height: 40,
          backgroundColor: 'black',
          borderRadius: '50%',
        }}
      />
    ),
    ...weaponColumns.reduce((acc, weapon) => {
      acc[weapon] = player.kills_by_weapon[weapon] || 0;
      return acc;
    }, {})
  }));

  const toggleTableVisibility = (group) => {
    setTablesVisibility((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  return (
    <div>
      {(() => {
        const fixedColumns = ['avatar', 'nickname'];
        const tables = [];
        let index = 0;

        Object.keys(columns).forEach((group) => {
          const chunk = columns[group];
          const tableColumns = index === 0 ? [...fixedColumns, ...chunk] : ['avatar', 'nickname', ...chunk];
          tables.push(
            <div key={`table-${index}`}>
              <Button
                variant="outlined"
                onClick={() => toggleTableVisibility(group)}
                sx={{ marginBottom: 2, display: 'block' }}
              >
                {tablesVisibility[group] ? `Hide ${group.replace(/([A-Z])/g, ' $1').toUpperCase()}` : `Show ${group.replace(/([A-Z])/g, ' $1').toUpperCase()}`}
              </Button>

              {tablesVisibility[group] && (
                <div>
                  <CustomTable
                    data={transformedData}
                    columns={tableColumns}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowColor={rowColor}
                  />
                </div>
              )}
            </div>
          );
          index++;
        });

        return tables;
      })()}

      <Button variant="contained" onClick={() => window.history.back()} sx={{ marginTop: 2 }}>
        Back to Previous Page
      </Button>
    </div>
  );
};

export default DetailedMatchPage;
