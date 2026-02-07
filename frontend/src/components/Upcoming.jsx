import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Paper,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DataGrid } from '@mui/x-data-grid';

// Helper component for team stats card
// eslint-disable-next-line react/prop-types
const TeamStatCard = memo(({ teamName, isHome, players }) => {
    // CS2 colors
    const homeColor = '#de6c2c'; // CS2 Orange
    const awayColor = '#4ade80'; // Green
    const accentColor = isHome ? homeColor : awayColor;
    
    // Calculate aggregate team stats if not provided directly
    const avgElo = players?.length 
        ? Math.round(players.reduce((acc, p) => acc + (p.game_skill_level || 5), 0) / players.length)
        : 0;
        
    return (
        <Card 
            elevation={0} 
            sx={{ 
                height: '100%', 
                background: '#1a1a1a',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderTop: `3px solid ${accentColor}`,
                borderRadius: 0,
                position: 'relative',
                overflow: 'visible'
            }}
        >
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <Avatar 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        margin: '0 auto', 
                        mb: 2,
                        bgcolor: 'transparent',
                        color: accentColor,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        border: `2px solid ${accentColor}`,
                        borderRadius: 0
                    }}
                >
                    {teamName?.charAt(0)}
                </Avatar>
                
                <Typography variant="h5" fontWeight="800" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 2, color: '#e5e5e5' }}>
                    {teamName}
                </Typography>
                <Chip 
                    label={isHome ? "YOUR TEAM" : "OPPONENT"} 
                    size="small" 
                    sx={{ 
                        bgcolor: 'transparent', 
                        color: accentColor,
                        border: `1px solid ${accentColor}`,
                        borderRadius: 0,
                        fontSize: '0.65rem',
                        letterSpacing: 1,
                        mb: 3 
                    }} 
                />

                <Stack direction="row" justifyContent="center" spacing={4} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />}>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888888', textTransform: 'uppercase', letterSpacing: 1 }}>Avg Level</Typography>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#e5e5e5' }}>{avgElo || '-'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888888', textTransform: 'uppercase', letterSpacing: 1 }}>Players</Typography>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#e5e5e5' }}>{players?.length || 0}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
});

// Main Component
// eslint-disable-next-line react/prop-types
const Upcoming = ({ teams, matches, playerStatsById, defaultTeam = null }) => {
  // CS2 Color Palette
  const cs2 = {
    bgDark: '#0d0d0d',
    bgCard: '#1a1a1a',
    accent: '#de6c2c',
    textPrimary: '#e5e5e5',
    textSecondary: '#888888',
    border: 'rgba(255,255,255,0.08)',
  };

  // Default to defaultTeam if provided and exists, otherwise first team
  const getInitialTeam = () => {
    if (defaultTeam && teams?.find(t => t.name === defaultTeam)) return defaultTeam;
    return teams?.[0]?.name || '';
  };
  const [homeTeam, setHomeTeam] = useState(getInitialTeam());
  const [nextMatch, setNextMatch] = useState(null);
  const [opponentTeam, setOpponentTeam] = useState('');

  // Update homeTeam when teams list changes (e.g. division change)
  useEffect(() => {
    if (teams && teams.length > 0) {
      // Prefer defaultTeam if provided and exists
      if (defaultTeam && teams.find(t => t.name === defaultTeam)) {
        setHomeTeam(defaultTeam);
        return;
      }
      if (!teams.find(t => t.name === homeTeam)) {
        setHomeTeam(teams[0].name);
      }
    }
  }, [teams, homeTeam, defaultTeam]);

  // Find next scheduled match logic
  useEffect(() => {
    if (homeTeam && matches && matches.length > 0) {
      const scheduledMatches = matches.filter(match => 
        match.status === 'SCHEDULED' && 
        (match.faction1_name === homeTeam || match.faction2_name === homeTeam)
      );
      
      scheduledMatches.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
      
      if (scheduledMatches.length > 0) {
        const match = scheduledMatches[0];
        setNextMatch(match);
        setOpponentTeam(match.faction1_name === homeTeam ? match.faction2_name : match.faction1_name);
      } else {
        setNextMatch(null);
        setOpponentTeam('');
      }
    }
  }, [homeTeam, matches]);

  // Simplify fetching roster logic for 'Head-to-Head' table
  // Filter teams from the `teams` prop
  const homeTeamData = teams.find(t => t.name === homeTeam);
  const opponentTeamData = teams.find(t => t.name === opponentTeam);

  // Flatten player data for the DataGrid
  const getRosterRows = (teamData) => {
      if (!teamData || !teamData.roster) return [];
      return teamData.roster.map(p => {
          const stats = playerStatsById[p.player_id] || {};
          return {
              id: p.player_id,
              nickname: p.nickname,
              avatar: p.avatar || '',
              elo: p.game_skill_level || 0, 
              kd: stats.kd ? parseFloat(stats.kd).toFixed(2) : '-',
              matches: stats.matches || 0,
              winRate: stats.win_rate || '-'
          };
      });
  };

  const columns = [
      { 
          field: 'nickname', 
          headerName: 'Player', 
          flex: 1, 
          renderCell: (params) => (
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Avatar src={params.row.avatar} sx={{ width: 24, height: 24 }}>{params.value?.[0]}</Avatar>
                 <Typography fontWeight="bold" variant="body2">{params.value}</Typography>
             </Box>
          ) 
      },
      { field: 'elo', headerName: 'Level', width: 70, align: 'center', headerAlign: 'center' },
      { field: 'kd', headerName: 'K/D', width: 70, align: 'center', headerAlign: 'center' },
      { field: 'matches', headerName: 'Games', width: 70, align: 'center', headerAlign: 'center' },
  ];

  if (!nextMatch) {
      return (
          <Box>
              {/* Team Selector */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 0 }}>
                  <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                          <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600 }}>
                              SELECT YOUR TEAM
                          </Typography>
                      </Grid>
                      <Grid item xs>
                          <FormControl fullWidth size="small">
                              <InputLabel sx={{ color: cs2.textSecondary }}>Team</InputLabel>
                              <Select
                                  value={homeTeam}
                                  label="Team"
                                  onChange={(e) => setHomeTeam(e.target.value)}
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
                                  {teams?.map((team) => (
                                      <MenuItem key={team.team_id} value={team.name}>
                                          {team.name}
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>
                      </Grid>
                  </Grid>
              </Paper>

              <Paper 
                elevation={0}
                sx={{ 
                    textAlign: 'center', 
                    py: 10, 
                    opacity: 0.8, 
                    background: cs2.bgCard,
                    border: `1px dashed ${cs2.border}`,
                    borderRadius: 0
                }}
              >
              <EmojiEventsIcon sx={{ fontSize: 60, mb: 2, opacity: 0.3, color: cs2.textSecondary }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: cs2.textPrimary }}>No Upcoming Matches</Typography>
              <Typography sx={{ color: cs2.textSecondary }}>There are no scheduled matches for {homeTeam} in the calendar.</Typography>
          </Paper>
          </Box>
      );
  }

  const matchDate = new Date(nextMatch.scheduled_at);

  return (
    <Box>
        {/* Team Selector */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 0 }}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600 }}>
                        SELECT YOUR TEAM
                    </Typography>
                </Grid>
                <Grid item xs>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: cs2.textSecondary }}>Team</InputLabel>
                        <Select
                            value={homeTeam}
                            label="Team"
                            onChange={(e) => setHomeTeam(e.target.value)}
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
                            {teams?.map((team) => (
                                <MenuItem key={team.team_id} value={team.name}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>

        {/* Match Details Banner */}
        <Paper 
            sx={{ 
                p: { xs: 2, md: 5 }, 
                mb: 4, 
                background: cs2.bgCard,
                textAlign: 'center',
                border: `1px solid ${cs2.border}`,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 0
            }}
        >
             <Chip 
                icon={<AccessTimeIcon sx={{ color: `${cs2.textSecondary} !important` }} />} 
                label={matchDate.toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                variant="outlined" 
                sx={{ 
                    mb: 3, 
                    borderColor: cs2.border,
                    color: cs2.textSecondary,
                    bgcolor: cs2.bgDark,
                    borderRadius: 0
                }} 
             />
             
             <Typography variant="h1" fontWeight="900" sx={{ 
                 fontSize: { xs: '3rem', md: '5rem' }, 
                 color: cs2.accent,
                 letterSpacing: 8,
                 mb: 4,
                 lineHeight: 1
             }}>
                 VS
             </Typography>

             <Grid container spacing={4} alignItems="center" justifyContent="center">
                 <Grid item xs={12} md={5}>
                     <TeamStatCard 
                        teamName={homeTeam} 
                        isHome={true} 
                        players={homeTeamData?.roster || []} 
                     />
                 </Grid>
                 
                 <Grid item xs={12} md={5}>
                    <TeamStatCard 
                        teamName={opponentTeam} 
                        isHome={false} 
                        players={opponentTeamData?.roster || []} 
                    />
                 </Grid>
             </Grid>
        </Paper>

        {/* Rosters Comparison */}
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                 <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cs2.accent, letterSpacing: 2, fontWeight: 600, mb: 1 }}>
                     <Grid3x3Icon fontSize="small" /> {homeTeam}
                 </Typography>
                 <Paper sx={{ height: 400, width: '100%', bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 0 }}>
                    <DataGrid 
                        rows={getRosterRows(homeTeamData)} 
                        columns={columns} 
                        hideFooter 
                        density="compact"
                        sx={{ 
                            border: 0, 
                            color: cs2.textPrimary,
                            '& .MuiDataGrid-cell': { borderBottom: `1px solid ${cs2.border}` },
                            '& .MuiDataGrid-columnHeaders': { bgcolor: cs2.bgDark, borderBottom: `1px solid ${cs2.border}`, color: cs2.textSecondary, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }
                        }}
                    />
                 </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                 <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4ade80', letterSpacing: 2, fontWeight: 600, mb: 1 }}>
                     <Grid3x3Icon fontSize="small" /> {opponentTeam}
                 </Typography>
                 <Paper sx={{ height: 400, width: '100%', bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 0 }}>
                    <DataGrid 
                        rows={getRosterRows(opponentTeamData)} 
                        columns={columns} 
                        hideFooter 
                        density="compact"
                        sx={{ 
                            border: 0, 
                            color: cs2.textPrimary,
                            '& .MuiDataGrid-cell': { borderBottom: `1px solid ${cs2.border}` },
                            '& .MuiDataGrid-columnHeaders': { bgcolor: cs2.bgDark, borderBottom: `1px solid ${cs2.border}`, color: cs2.textSecondary, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }
                        }}
                    />
                 </Paper>
            </Grid>
        </Grid>
    </Box>
  );
};

export default memo(Upcoming);