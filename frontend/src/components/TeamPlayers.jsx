/* eslint-disable react/prop-types */
import { useState, useEffect, memo, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import statsService from '../services/statsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const TeamPlayersTable = ({
  teams,
  playerStatsById,
  handleTeamClick,
  globalPlayers = [],
  defaultTeam = null
}) => {
  // Initialize with defaultTeam if provided, otherwise first team or fallback
  const getInitialTeam = () => {
    if (defaultTeam && teams?.find(t => t.name === defaultTeam)) return defaultTeam;
    return teams && teams.length > 0 ? teams[0].name : "Rakkauden Kanaali";
  };
  const [selectedTeam, setSelectedTeam] = useState(getInitialTeam());

  // Sync state when teams prop updates (e.g. division change)
  useEffect(() => {
    if (teams && teams.length > 0) {
      // Check if defaultTeam exists in current teams
      if (defaultTeam && teams.find(t => t.name === defaultTeam)) {
        setSelectedTeam(defaultTeam);
        return;
      }
      // Check if current selectedTeam is in the new teams list
      const currentTeamExists = teams.find(t => t.name === selectedTeam);
      if (!currentTeamExists) {
        // If not, default to the first team of the new division
        setSelectedTeam(teams[0].name);
      }
    }
  }, [teams, selectedTeam, defaultTeam]);

  // Local state for Faceit Details (Elo, Avatar)
  const [faceitData, setFaceitStats] = useState({});

  // Fetch Faceit Data for the current roster - uses new live API endpoint
  useEffect(() => {
    const fetchTeamFaceitData = async () => {
        const team = teams?.find(t => t.name === selectedTeam) || teams?.[0];
        if (!team || !team.roster) return;

        // Gather nicknames we don't have data for yet
        const nicknamesNeeded = team.roster
            .map(p => p.nickname)
            .filter(nick => !faceitData[nick]);
        
        if (nicknamesNeeded.length === 0) return;
        
        const results = await Promise.allSettled(
            nicknamesNeeded.map(async (nickname) => {
                try {
                    const data = await statsService.fetchFaceitProfile(nickname);
                    return { nickname, data };
                } catch {
                    return { nickname, data: null };
                }
            })
        );

        const newData = {};
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value.data) {
                newData[result.value.nickname] = result.value.data;
            }
        });

        if (Object.keys(newData).length > 0) {
            setFaceitStats(prev => ({ ...prev, ...newData }));
        }
    };

    fetchTeamFaceitData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam, teams]);

  // Ensure selected team exists, otherwise fallback to first team
  const validSelectedTeam = teams?.find(t => t.name === selectedTeam) 
       ? selectedTeam 
       : teams?.[0]?.name || '';
  
  const currentTeam = useMemo(() => 
    teams?.find((t) => t.name === validSelectedTeam) || null,
    [teams, validSelectedTeam]
  );

  /** 🔹 Aggregate map-level stats specifically from tournament data */
  const mapStats = useMemo(() => {
    if (!currentTeam) return [];
    
    const mapTotals = {};
    currentTeam.roster.forEach((player) => {
      const tournamentMaps =
        playerStatsById[player.player_id]?.tournament_stats?.played_maps || {};

      Object.entries(tournamentMaps).forEach(([mapKey, value]) => {
        const isWin = mapKey.endsWith("_wins");
        const map = isWin ? mapKey.replace("_wins", "") : mapKey;

        if (!mapTotals[map]) mapTotals[map] = { played: 0, wins: 0 };

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
  }, [currentTeam, playerStatsById]);

  // If no teams are loaded, show nothing or a loader
  if (!teams || teams.length === 0) {
      return <Box p={3}><Typography>No team data available.</Typography></Box>;
  }

  const handleTeamSelect = (e) => {
    const teamName = e.target.value;
    setSelectedTeam(teamName);
    const team = teams.find((t) => t.name === teamName);
    if (team) handleTeamClick(team);
  };

  const columns = [
    { 
        field: 'avatar', 
        headerName: '', 
        width: 60,
        sortable: false,
        display: 'flex',
        renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Avatar 
                    src={params.value} 
                    alt={params.row.nickname}
                    variant="rounded"
                    sx={{ width: 32, height: 32 }}
                >
                    {params.row.nickname?.charAt(0)}
                </Avatar>
            </Box>
        ) 
    },
    { 
        field: "nickname", 
        headerName: "Player", 
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
             <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography fontWeight="bold" variant="body2">{params.value}</Typography>
            </Box>
        )
    },
    { 
        field: "faceitLevel", 
        headerName: "Lvl", 
        width: 60, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => {
            const level = Number(params.value);
            // CS2-inspired level colors
            let color = '#666666'; // default grey
            if (level >= 10) color = '#de6c2c'; // CS2 Orange (top tier)
            else if (level >= 8) color = '#ef4444'; // Red
            else if (level >= 6) color = '#f59e0b'; // Amber
            else if (level >= 4) color = '#84cc16'; // Lime
            else if (level >= 1) color = '#22c55e'; // Green
            
            return (
                <Box sx={{ 
                    width: 26, 
                    height: 26, 
                    borderRadius: 0,
                    border: `2px solid ${color}`,
                    bgcolor: 'transparent', 
                    color: color, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                }}>
                    {params.value !== '?' ? params.value : '-'}
                </Box>
            )
        }
    },
    { 
        field: "faceitElo", 
        headerName: "Elo", 
        width: 80, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => {
            const elo = Number(params.value) || 0;
            let color = '#888888';
            if (elo >= 2000) color = '#de6c2c'; // CS2 Orange (Elite)
            else if (elo >= 1500) color = '#ef4444'; // Red
            else if (elo >= 1000) color = '#f59e0b'; // Amber
            else if (elo > 0) color = '#84cc16'; // Lime
            
            return (
                <Typography variant="body2" sx={{ color, fontFamily: '"Roboto Mono", monospace', fontWeight: 600 }}>
                    {params.value !== '-' ? params.value : '—'}
                </Typography>
            );
        }
    },
    { 
        field: "kd", 
        headerName: "K/D", 
        width: 90, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => {
            const kd = parseFloat(params.value);
            let color = '#888888';
            if (kd >= 1.3) color = '#4ade80'; // Green
            else if (kd >= 1.0) color = '#e5e5e5'; // White
            else color = '#ef4444'; // Red
            
            return (
                <Typography variant="body2" sx={{ color, fontFamily: '"Roboto Mono", monospace', fontWeight: 600 }}>
                    {params.value}
                </Typography>
            );
        }
    },
    { 
        field: "hsPercent", 
        headerName: "HS %", 
        width: 90, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => (
            <Typography variant="body2" sx={{ color: '#de6c2c', fontFamily: '"Roboto Mono", monospace' }}>
                {params.value}
            </Typography>
        )
    },
    { 
        field: "kr", 
        headerName: "K/R", 
        width: 90, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => (
            <Typography variant="body2" sx={{ color: '#888888', fontFamily: '"Roboto Mono", monospace' }}>
                {params.value}
            </Typography>
        )
    },
    { 
        field: "matches", 
        headerName: "Matches", 
        width: 90, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => (
            <Typography variant="body2" sx={{ color: '#888888' }}>
                {params.value || 0}
            </Typography>
        )
    },
    { 
        field: "winRate", 
        headerName: "Win %", 
        width: 90, 
        align: 'center', 
        headerAlign: 'center',
        renderCell: (params) => {
            const rate = parseInt(params.value) || 0;
            let color = '#888888';
            if (rate >= 55) color = '#4ade80';
            else if (rate >= 50) color = '#e5e5e5';
            else if (rate > 0) color = '#ef4444';
            
            return (
                <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                    {params.value}
                </Typography>
            );
        }
    },
  ];

  const rows = currentTeam
    ? currentTeam.roster.map((player) => {
        // Stats can be in 'stats' or 'tournament_stats' and might have various casing key issues
        // We prioritize 'stats' from the detailed player fetch (playerStatsById)
        const detailedPlayer = playerStatsById[player.player_id] || {};
        const stats = detailedPlayer.stats || {};
        const playedMaps = stats.played_maps || {};
        // 1. Calculate K/D/HS/KR from stats (Capitalized keys presumed from Azure/Demo data)
        const kills = stats.Kills || stats.kills || 0;
        const deaths = stats.Deaths || stats.deaths || 1; 
        const headshots = stats.Headshots || stats.headshots || 0;
        const rounds = stats.Rounds || stats.rounds || 1;

        // 2. Calculate Matches/Wins
        // Fix based on debug data: use played_matches
        let matches = stats.played_matches || stats.Matches || stats.matches || stats.matchesPlayed || stats.MatchesPlayed || 0;
        let wins = stats.Wins || stats.wins || 0;

        if (!matches && Object.keys(playedMaps).length > 0) {
             Object.entries(playedMaps).forEach(([key, val]) => {
                  if (!key.endsWith('_wins')) {
                      matches += val;
                  }
             });
        }
        
        // Calculate wins from played_maps if not explicitly in stats
        if (!wins && Object.keys(playedMaps).length > 0) {
            Object.entries(playedMaps).forEach(([key, val]) => {
                 if (key.endsWith('_wins')) {
                     wins += val;
                 }
            });
        }
        
        // 3. Elo & Level
        // Prefer detailed player object (fetched on click), fallback to roster data
        // Fix based on debug data: 'points' or 'faceit_elo' might be missing, 
        // but often roster 'player' object has 'game_skill_level'.
        // The debug data shows 'faceit_lvl' is present in detailedData.

        // Lookup in global players list (from Home Page data)
        const globalProfile = globalPlayers.find(gp => gp.nickname === player.nickname);
        const liveFaceit = faceitData[player.nickname];
        
        // New endpoint returns { elo, level, avatar } directly
        const elo = liveFaceit?.elo 
            || detailedPlayer.elo 
            || detailedPlayer.faceit_elo 
            || detailedPlayer.faceit?.elo 
            || player.faceit_elo 
            || player.elo
            || globalProfile?.elo
            || globalProfile?.faceit_elo
            || '-';
            
        const level = liveFaceit?.level
            || detailedPlayer.faceit_lvl 
            || detailedPlayer.game_skill_level 
            || player.game_skill_level 
            || player.faceit_lvl 
            || globalProfile?.game_skill_level
            || globalProfile?.faceit_lvl
            || '?';

        const avatar = liveFaceit?.avatar 
            || detailedPlayer.avatar 
            || player.avatar 
            || globalProfile?.avatar;

        return {
          id: player.player_id,
          nickname: player.nickname,
          avatar: avatar, // Prefer detailed avatar
          faceitLevel: level,
          faceitElo: elo, 
          kd: (kills / deaths).toFixed(2),
          hsPercent: kills ? ((headshots / kills) * 100).toFixed(1) + '%' : '0%',
          kr: (kills / rounds).toFixed(2),
          matches: matches,
          winRate: matches ? ((wins / matches) * 100).toFixed(0) + '%' : '0%',
        };
      })
    : [];

  // CS2 Color Palette
  const cs2 = {
    bgDark: '#0d0d0d',
    bgCard: '#1a1a1a',
    bgHover: '#252525',
    accent: '#de6c2c',
    textPrimary: '#e5e5e5',
    textSecondary: '#888888',
    border: 'rgba(255,255,255,0.08)',
    green: '#4ade80',
    red: '#ef4444'
  };

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {/* Header & Controls */}
      <Paper 
          sx={{ 
              p: 3, 
              mb: 3, 
              background: cs2.bgCard,
              borderBottom: `1px solid ${cs2.border}`,
              borderRadius: 0
          }}
      >
          <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={6}>
                  <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600 }}>
                      ROSTER ANALYSIS
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: cs2.textPrimary, mt: 0.5 }}>
                      Team Scouting
                  </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                    <InputLabel id="team-select-label" sx={{ color: cs2.textSecondary }}>Select Team</InputLabel>
                    <Select
                      labelId="team-select-label"
                      value={validSelectedTeam}
                      label="Select Team"
                      onChange={handleTeamSelect}
                      sx={{ 
                          color: cs2.textPrimary,
                          bgcolor: cs2.bgDark,
                          borderRadius: 0,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                          '& .MuiSvgIcon-root': { color: cs2.textSecondary }
                      }}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team.team_id} value={team.name}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              </Grid>
          </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Roster Table */}
        <Grid item xs={12} lg={12}>
          <Paper 
             sx={{ 
                 height: 500, 
                 width: '100%', 
                 bgcolor: cs2.bgCard, 
                 border: `1px solid ${cs2.border}`,
                 borderRadius: 0,
                 overflow: 'hidden'
             }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              rowHeight={60}
              slots={{ toolbar: GridToolbar }}
              sx={{
                border: 0,
                color: cs2.textPrimary,
                fontFamily: '"Inter", "Roboto", sans-serif',
                '& .MuiDataGrid-columnHeaders': {
                    bgcolor: cs2.bgDark,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: 1.5,
                    borderBottom: `1px solid ${cs2.border}`,
                    color: cs2.textSecondary
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${cs2.border}`
                },
                '& .MuiDataGrid-row:hover': {
                    bgcolor: cs2.bgHover
                },
                '& .MuiTablePagination-root': {
                    color: cs2.textSecondary
                },
                '& .MuiDataGrid-toolbarContainer': {
                    p: 2,
                    borderBottom: `1px solid ${cs2.border}` 
                },
                '& .MuiButton-root': {
                    color: cs2.textSecondary,
                    '&:hover': { color: cs2.accent }
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Map Stats Chart */}
        <Grid item xs={12}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 0 }}>
                <CardContent>
                    <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600 }}>
                        MAP POOL
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: cs2.textPrimary, mt: 0.5 }}>Performance Analysis</Typography>
                    <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                        <ResponsiveContainer>
                          <BarChart
                            data={mapStats}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="map" stroke={cs2.textSecondary} tick={{ fill: cs2.textSecondary, fontSize: 11 }} />
                            <YAxis stroke={cs2.textSecondary} tick={{ fill: cs2.textSecondary, fontSize: 11 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: cs2.bgDark, border: `1px solid ${cs2.border}`, color: cs2.textPrimary, borderRadius: 0 }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="wins" name="Wins" fill={cs2.green} radius={0} />
                            <Bar dataKey="losses" name="Losses" fill={cs2.red} radius={0} />
                          </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(TeamPlayersTable);
