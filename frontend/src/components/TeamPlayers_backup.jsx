/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// eslint-disable-next-line react/prop-types
const TeamPlayersTable = ({
  teams,
  playerStatsById,
  handleTeamClick,
}) => {
  const [selectedTeam, setSelectedTeam] = useState("Rakkauden Kanaali");
  const theme = useTheme();

  // If no teams are loaded, show nothing or a loader
  if (!teams || teams.length === 0) {
      return <Box p={3}><Typography>No team data available.</Typography></Box>;
  }

  // Ensure selected team exists, otherwise fallback to first team
  const validSelectedTeam = teams.find(t => t.name === selectedTeam) 
       ? selectedTeam 
       : teams[0]?.name;
  
  // Update state if we had to fallback, but avoid infinite loop by only doing it if mismatched
  // Actually closer to standard React pattern is just to calculate derived state
  
  const currentTeam = teams.find((t) => t.name === validSelectedTeam);

  const handleTeamSelect = (e) => {
    const teamName = e.target.value;
    setSelectedTeam(teamName);
    const team = teams.find((t) => t.name === teamName);
    if (team) handleTeamClick(team);
  };

  const calculateBasicStats = (stats) => {
    const kills = stats.Kills ?? 0;
    const deaths = stats.Deaths ?? 1; // avoid division by zero
    const headshots = stats.Headshots ?? 0;
    const rounds = stats.Rounds ?? 1;

    const kd = (kills / deaths).toFixed(2);
    const hsPercent = kills ? ((headshots / kills) * 100).toFixed(1) : "0";
    const kr = (kills / rounds).toFixed(2);

    return { kd, hsPercent, kr };
  };

  /** 🔹 Aggregate map-level stats specifically from tournament data */
  const calculateTournamentMapStats = (team) => {
    const mapTotals = {};

    team.roster.forEach((player) => {
      const tournamentMaps =
        playerStatsById[player.player_id]?.tournament_stats?.played_maps || {};

      Object.entries(tournamentMaps).forEach(([mapKey, value]) => {
        const isWin = mapKey.endsWith("_wins");
        const map = isWin ? mapKey.replace("_wins", "") : mapKey;

        if (!mapTotals[map]) mapTotals[map] = { played: 0, wins: 0 };

        // Instead of summing, take the maximum
        if (isWin) {
          mapTotals[map].wins = Math.max(mapTotals[map].wins, value);
        } else {
          mapTotals[map].played = Math.max(mapTotals[map].played, value);
        }
      });
    });

    return Object.entries(mapTotals).map(([map, { played, wins }]) => ({
      map,
      played,
      wins,
      losses: played - wins,
      winRate: played ? ((wins / played) * 100).toFixed(1) : 0,
    }));
  };


  /** 🔹 Aggregate map-level stats for a team */
  const calculateTeamMapStats = (team) => {
    const mapTotals = {};

    team.roster.forEach((player) => {
      const statsMaps =
        playerStatsById[player.player_id]?.stats?.played_maps || {};
      
      const tournamentMaps =
      playerStatsById[player.player_id]?.tournament_stats?.played_maps || {};
      const combinedMaps = { ...statsMaps, ...tournamentMaps };

      Object.entries(combinedMaps).forEach(([mapKey, value]) => {
        // normalize map name
        const isWin = mapKey.endsWith("_wins");
        const map = isWin ? mapKey.replace("_wins", "") : mapKey;

        if (!mapTotals[map]) mapTotals[map] = { played: 0, wins: 0 };

        if (isWin) {
          mapTotals[map].wins += value;
        } else {
          mapTotals[map].played += value;
        }
      });
    });

    return Object.entries(mapTotals).map(([map, { played, wins }]) => ({
      map,
      played,
      wins,
      losses: played - wins,        // 🔹 calculate losses per map
      winRate: played ? ((wins / played) * 100).toFixed(1) : 0,
    }));
  };

  const RenderTeamDataGrid = ({ team }) => {
    if (!team.roster || team.roster.length === 0)
        return <Typography>No players found.</Typography>;

    // Prepare Columns & Rows
    // Dynamic Columns Logic
    const firstPlayerStats = playerStatsById[team.roster[0].player_id]?.stats || {};
    const firstPlayerTournamentStats = playerStatsById[team.roster[0].player_id]?.tournament_stats || {};
    
    // Safety check just in case playerStatsById is incomplete
    if(!firstPlayerStats) return <Typography>No stats available</Typography>;

    const statKeys = Object.keys(firstPlayerStats).filter(k => k !== "played_maps");
    const tournamentStatKeys = Object.keys(firstPlayerTournamentStats).filter(k => k !== "played_maps");
    
    const mapNames = Array.from(
        new Set(
            team.roster.flatMap((player) => {
                const statsMaps = Object.keys(playerStatsById[player.player_id]?.stats?.played_maps || {});
                const tournamentMaps = Object.keys(playerStatsById[player.player_id]?.tournament_stats?.played_maps || {});
                return [...statsMaps, ...tournamentMaps];
            })
        )
    );

    const columns = [
        { field: 'nickname', headerName: 'Player', width: 150 },
        { 
            field: 'level', 
            headerName: 'Level', 
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        backgroundColor: Number(params.value) >= 8 ? theme.palette.error.main : Number(params.value) >= 6 ? theme.palette.warning.main : theme.palette.success.main,
                        color: "white",
                        fontWeight: 'bold'
                    }}
                />
            )
        },
        { field: 'kd', headerName: 'K/D', width: 80, type: 'number' },
        { field: 'kr', headerName: 'K/R', width: 80, type: 'number' },
        { field: 'hsPercent', headerName: 'HS%', width: 80, valueFormatter: (val) => `${val}%`, type: 'number' },
    ];

    // Add Stat Keys
    statKeys.forEach(key => {
        columns.push({ field: `stat_${key}`, headerName: key, width: 100, type: 'number' });
    });

    // Add Tournament Keys
    tournamentStatKeys.forEach(key => {
        columns.push({ field: `tourn_${key}`, headerName: `${key} (Tourn)`, width: 120, type: 'number' });
    });

    // Add Map Keys
    mapNames.forEach(map => {
        columns.push({ 
            field: `map_${map}`, 
            headerName: map, 
            width: 120,
            valueGetter: (value, row) => {
                 // row has flattened props
                 return `${row[`map_${map}_stats`] || 0} / ${row[`map_${map}_tourn`] || 0}`;
            }
        });
    });

    const rows = team.roster.map((player) => {
        const stats = playerStatsById[player.player_id]?.stats || {};
        const tStats = playerStatsById[player.player_id]?.tournament_stats || {};
        const statsMap = stats.played_maps || {};
        const tournamentMap = tStats.played_maps || {};
        const { kd, kr, hsPercent } = calculateBasicStats(stats);
        
        const rowData = {
            id: player.player_id,
            nickname: player.nickname,
            level: player.game_skill_level ?? player.faceit_lvl ?? '?',
            kd,
            kr,
            hsPercent,
        };

        statKeys.forEach(key => { rowData[`stat_${key}`] = stats[key] ?? 0; });
        tournamentStatKeys.forEach(key => { rowData[`tourn_${key}`] = tStats[key] ?? 0; });
        mapNames.forEach(map => { 
            rowData[`map_${map}_stats`] = statsMap[map] ?? 0;
            rowData[`map_${map}_tourn`] = tournamentMap[map] ?? 0;
        });

        return rowData;
    });

    // Charts
    const tournamentMapStats = calculateTournamentMapStats(team);
    const overallMapStats = calculateTeamMapStats(team);
    overallMapStats.sort((a, b) => b.played - a.played);
    if(tournamentMapStats.length > 0) tournamentMapStats.sort((a, b) => b.played - a.played);


    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {tournamentMapStats.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Tournament Performance</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={tournamentMapStats} margin={{ bottom: 20 }}>
                                    <XAxis dataKey="map" interval={0} angle={-30} textAnchor="end" height={60} tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="played" fill="#95A5A6" name="Played" />
                                    <Bar dataKey="wins" fill="#2ECC71" name="Wins" />
                                    <Bar dataKey="losses" fill="#E74C3C" name="Losses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                {overallMapStats.length > 0 && (
                     <Grid item xs={12} md={6}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Overall Performance</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={overallMapStats} margin={{ bottom: 20 }}>
                                    <XAxis dataKey="map" interval={0} angle={-30} textAnchor="end" height={60} tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="played" fill="#BDC3C7" name="Played" />
                                    <Bar dataKey="wins" fill="#27AE60" name="Wins" />
                                    <Bar dataKey="losses" fill="#E74C3C" name="Losses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Paper sx={{ height: 600, width: '100%', mb: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    sx={{ border: 0 }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                />
            </Paper>
        </Box>
    );
  };

  const displayTeams = selectedTeam
    ? teams.filter((team) => team.name === selectedTeam)
    : teams;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Teams and Players
      </Typography>

      <FormControl fullWidth sx={{ mb: 4, maxWidth: 400 }}>
        <InputLabel id="team-select-label">Select Team</InputLabel>
        <Select
          labelId="team-select-label"
          id="team-select"
          value={selectedTeam}
          label="Select Team"
          onChange={handleTeamSelect}
        >
            {/* Added All Teams option back if logic supports it, though original code had it */}
          <MenuItem value="">
            <em>All Teams</em>
          </MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.name} value={team.name}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {displayTeams.length === 0 && <Typography>No teams found.</Typography>}

      {displayTeams.map((team) => (
        <Box key={team.name} mb={5}>
          { (expandedTeam === team.name || selectedTeam) && (
              <RenderTeamDataGrid team={team} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TeamPlayersTable;
