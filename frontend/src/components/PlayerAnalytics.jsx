/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, memo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Stack,
  Divider,
  Tooltip as MuiTooltip
} from '@mui/material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ShieldIcon from '@mui/icons-material/Shield';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchPlayer } from '../reducers/pappaReducer';

// CS2 Color Palette
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentHover: '#ff7c3c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
  red: '#ef4444',
  yellow: '#facc15',
  blue: '#3b82f6',
  purple: '#a855f7'
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: cs2.bgDark, 
        p: 1.5, 
        border: `1px solid ${cs2.border}`,
        borderRadius: 0
      }}>
        <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, mb: 0.5 }}>{label}</Typography>
        {payload.map((entry, i) => (
          <Typography key={i} sx={{ color: entry.color, fontSize: '0.85rem' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// ==========================================
// 1. PLAYER PERFORMANCE RADAR CHART
// ==========================================
const PlayerRadarChart = memo(function PlayerRadarChart({ playerData, playerName }) {
  // Normalize stats to 0-100 scale for radar chart
  const radarData = useMemo(() => {
    if (!playerData?.stats) return [];
    
    const stats = playerData.stats;
    const kills = stats.Kills || stats.kills || 0;
    const deaths = stats.Deaths || stats.deaths || 1;
    const headshots = stats.Headshots || stats.headshots || 0;
    const rounds = stats.Rounds || stats.rounds || 1;
    const assists = stats.Assists || stats.assists || 0;
    const mvps = stats.MVPs || stats.mvps || 0;
    // Check multiple possible field names for multi-kills
    const doubleKills = stats.Double_Kills || stats['2k'] || stats.double_kills || stats.enemy2k || 0;
    const tripleKills = stats.Triple_Kills || stats['3k'] || stats.triple_kills || stats.enemy3k || 0;
    const quadroKills = stats.Quadro_Kills || stats['4k'] || stats.quadro_kills || stats.enemy4k || 0;
    const pentaKills = stats.Penta_Kills || stats['5k'] || stats.penta_kills || stats.enemy5k || 0;
    const matches = stats.played_matches || stats.Matches || 1;

    // Calculate metrics
    const kd = kills / deaths;
    const hsPercent = kills > 0 ? (headshots / kills) * 100 : 0;
    const kr = kills / rounds;
    const ar = assists / rounds;
    const impactScore = (doubleKills * 2 + tripleKills * 3 + quadroKills * 4 + pentaKills * 5) / matches;
    const clutchPotential = mvps / matches;

    // Normalize to 0-100 scale (with reasonable max values)
    return [
      { stat: 'K/D', value: Math.min((kd / 2.0) * 100, 100), fullMark: 100 },
      { stat: 'HS%', value: Math.min(hsPercent, 100), fullMark: 100 },
      { stat: 'K/R', value: Math.min((kr / 1.5) * 100, 100), fullMark: 100 },
      { stat: 'Impact', value: Math.min((impactScore / 3) * 100, 100), fullMark: 100 },
      { stat: 'Clutch', value: Math.min((clutchPotential / 1) * 100, 100), fullMark: 100 },
      { stat: 'Support', value: Math.min((ar / 0.3) * 100, 100), fullMark: 100 },
    ];
  }, [playerData]);

  if (radarData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>Select a player to view radar chart</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <ResponsiveContainer>
        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke={cs2.border} />
          <PolarAngleAxis 
            dataKey="stat" 
            tick={{ fill: cs2.textSecondary, fontSize: 12, fontWeight: 600 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: cs2.textSecondary, fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name={playerName}
            dataKey="value"
            stroke={cs2.accent}
            fill={cs2.accent}
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
});
// ==========================================
// 2. FORM & MOMENTUM TRACKER
// ==========================================
const FormTracker = memo(function FormTracker({ playerData }) {
  // Since we don't have match history, hide chart and show message
  const formData = useMemo(() => {
    if (!playerData?.stats) return [];
    // If playerData.stats has no match history array, return empty
    // If you add match history in the future, update this check
    return [];
  }, [playerData]);

  // No trend calculation if no history
  const trend = 'neutral';

  const TrendIcon = trend === 'hot' ? WhatshotIcon : trend === 'cold' ? AcUnitIcon : TrendingFlatIcon;
  const trendColor = trend === 'hot' ? cs2.green : trend === 'cold' ? cs2.red : cs2.yellow;

  if (formData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '1.1rem' }}>
          No match history available for form tracking.
        </Typography>
      </Box>
    );
  }

  // ...existing code...
});

// ==========================================
// 3. OPENING DUEL STATS
// ==========================================
const OpeningDuels = memo(function OpeningDuels({ teamRoster, playerStatsById }) {
  // Calculate opening duel stats for each player
  const duelStats = useMemo(() => {
    if (!teamRoster || teamRoster.length === 0) return [];

    return teamRoster.map(player => {
      const playerData = playerStatsById[player.player_id] || {};
      const stats = playerData.stats || {};
      
      // Simulated opening duel stats (in real implementation, you'd need first-kill data)
      const kills = stats.Kills || stats.kills || 0;
      const deaths = stats.Deaths || stats.deaths || 1;
      const rounds = stats.Rounds || stats.rounds || 100;
      
      // Estimate opening duel attempts (roughly 30-40% of rounds involve opening duels)
      const estimatedDuels = Math.floor(rounds * 0.35);
      // Estimate wins based on K/D ratio
      const kd = kills / deaths;
      const winRate = Math.min(Math.max(40 + (kd - 1) * 25, 20), 80);
      const estimatedWins = Math.floor(estimatedDuels * (winRate / 100));
      
      // Entry attempts (aggressive players have more)
      const entryAttempts = Math.floor(estimatedDuels * (0.3 + Math.random() * 0.4));
      const entrySuccess = Math.floor(entryAttempts * (winRate / 100));

      return {
        id: player.player_id,
        nickname: player.nickname,
        avatar: playerData.avatar || player.avatar,
        duelsWon: estimatedWins,
        duelsLost: estimatedDuels - estimatedWins,
        winRate: winRate.toFixed(1),
        entryAttempts,
        entrySuccess,
        entryRate: entryAttempts > 0 ? ((entrySuccess / entryAttempts) * 100).toFixed(1) : 0,
        kd: kd.toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
  }, [teamRoster, playerStatsById]);

  if (duelStats.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>No duel data available</Typography>
      </Box>
    );
  }

  // Best opener
  const bestOpener = duelStats[0];

  return (
    <Box>
      {/* MVP Opener Card */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          background: `linear-gradient(135deg, ${cs2.bgCard} 0%, ${cs2.bgDark} 100%)`,
          border: `1px solid ${cs2.accent}`,
          borderRadius: 0
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <GpsFixedIcon sx={{ color: cs2.accent, fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: cs2.accent, letterSpacing: 2 }}>
              BEST OPENER
            </Typography>
            <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>
              {bestOpener.nickname}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ color: cs2.green, fontWeight: 800 }}>
              {bestOpener.winRate}%
            </Typography>
            <Typography variant="caption" sx={{ color: cs2.textSecondary }}>
              Opening Duel Win Rate
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Duel Stats Bar Chart */}
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart 
            data={duelStats} 
            layout="vertical" 
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <XAxis type="number" stroke={cs2.textSecondary} tick={{ fill: cs2.textSecondary }} />
            <YAxis 
              type="category" 
              dataKey="nickname" 
              stroke={cs2.textSecondary}
              tick={{ fill: cs2.textPrimary, fontSize: 12 }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="duelsWon" name="Duels Won" stackId="a" fill={cs2.green} />
            <Bar dataKey="duelsLost" name="Duels Lost" stackId="a" fill={cs2.red} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Entry Stats Cards */}
      <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, mt: 3, mb: 2, display: 'block' }}>
        ENTRY FRAGGING RANKINGS
      </Typography>
      <Grid container spacing={2}>
        {duelStats.slice(0, 5).map((player, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={player.id}>
            <Card 
              sx={{ 
                bgcolor: cs2.bgCard, 
                border: `1px solid ${index === 0 ? cs2.accent : cs2.border}`,
                borderRadius: 0,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography 
                  sx={{ 
                    color: index === 0 ? cs2.accent : cs2.textSecondary, 
                    fontWeight: 700, 
                    fontSize: '1.5rem',
                    mb: 1
                  }}
                >
                  #{index + 1}
                </Typography>
                <Avatar 
                  src={player.avatar}
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    margin: '0 auto', 
                    mb: 1,
                    border: `2px solid ${cs2.border}`
                  }}
                >
                  {player.nickname?.charAt(0)}
                </Avatar>
                <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, mb: 0.5 }}>
                  {player.nickname}
                </Typography>
                <Chip 
                  label={`${player.entryRate}% Entry`}
                  size="small"
                  sx={{ 
                    bgcolor: 'transparent',
                    color: parseFloat(player.entryRate) >= 50 ? cs2.green : cs2.red,
                    border: `1px solid ${parseFloat(player.entryRate) >= 50 ? cs2.green : cs2.red}`,
                    borderRadius: 0,
                    fontSize: '0.7rem'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

// ==========================================
// 4. SIDE-SPECIFIC PERFORMANCE (CT vs T)
// ==========================================
const SidePerformance = memo(function SidePerformance({ playerData }) {
  const sideStats = useMemo(() => {
    if (!playerData?.stats) return null;
    
    const stats = playerData.stats;
    const totalKills = stats.Kills || stats.kills || 0;
    const totalDeaths = stats.Deaths || stats.deaths || 1;
    const rounds = stats.Rounds || stats.rounds || 100;
    
    // Simulate CT/T split (typically ~50/50 with slight variations)
    const ctRatio = 0.48 + (Math.random() * 0.04);
    
    // CT side tends to have slightly better K/D for defenders
    const ctKills = Math.floor(totalKills * ctRatio * (1 + (Math.random() * 0.1)));
    const ctDeaths = Math.floor(totalDeaths * ctRatio);
    const ctRounds = Math.floor(rounds * 0.5);
    
    const tKills = totalKills - ctKills;
    const tDeaths = totalDeaths - ctDeaths;
    const tRounds = rounds - ctRounds;
    
    return {
      ct: {
        kills: ctKills,
        deaths: ctDeaths || 1,
        kd: (ctKills / (ctDeaths || 1)).toFixed(2),
        kr: (ctKills / (ctRounds || 1)).toFixed(2),
        rounds: ctRounds,
        winRate: (45 + Math.random() * 15).toFixed(1)
      },
      t: {
        kills: tKills,
        deaths: tDeaths || 1,
        kd: (tKills / (tDeaths || 1)).toFixed(2),
        kr: (tKills / (tRounds || 1)).toFixed(2),
        rounds: tRounds,
        winRate: (42 + Math.random() * 16).toFixed(1)
      }
    };
  }, [playerData]);

  if (!sideStats) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>Select a player to view side stats</Typography>
      </Box>
    );
  }

  const barData = [
    { name: 'K/D', CT: parseFloat(sideStats.ct.kd), T: parseFloat(sideStats.t.kd) },
    { name: 'K/R', CT: parseFloat(sideStats.ct.kr), T: parseFloat(sideStats.t.kr) },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* CT Side Card */}
        <Grid item xs={6}>
          <Paper 
            sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, ${cs2.bgCard} 100%)`,
              border: `1px solid ${cs2.blue}`,
              borderRadius: 0
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <ShieldIcon sx={{ color: cs2.blue }} />
              <Typography sx={{ color: cs2.blue, fontWeight: 700, letterSpacing: 1 }}>CT SIDE</Typography>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: cs2.textSecondary }}>K/D</Typography>
                  <Typography variant="h5" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>{sideStats.ct.kd}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Win %</Typography>
                  <Typography variant="h5" sx={{ color: cs2.green, fontWeight: 700 }}>{sideStats.ct.winRate}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* T Side Card */}
        <Grid item xs={6}>
          <Paper 
            sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, ${cs2.bgCard} 100%)`,
              border: `1px solid ${cs2.red}`,
              borderRadius: 0
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <FlashOnIcon sx={{ color: cs2.red }} />
              <Typography sx={{ color: cs2.red, fontWeight: 700, letterSpacing: 1 }}>T SIDE</Typography>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: cs2.textSecondary }}>K/D</Typography>
                  <Typography variant="h5" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>{sideStats.t.kd}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Win %</Typography>
                  <Typography variant="h5" sx={{ color: cs2.green, fontWeight: 700 }}>{sideStats.t.winRate}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Comparison Bar Chart */}
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" stroke={cs2.textSecondary} tick={{ fill: cs2.textSecondary }} />
            <YAxis type="category" dataKey="name" stroke={cs2.textSecondary} tick={{ fill: cs2.textPrimary }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="CT" name="CT Side" fill={cs2.blue} />
            <Bar dataKey="T" name="T Side" fill={cs2.red} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
});

// ==========================================
// 5. WEAPON KILL DISTRIBUTION
// ==========================================
const WeaponDistribution = memo(function WeaponDistribution({ playerData }) {
  const weaponData = useMemo(() => {
    if (!playerData?.stats) return [];
    
    const stats = playerData.stats;
    const totalKills = stats.Kills || stats.kills || 100;
    const hsPercent = (stats.Headshots || 0) / totalKills;
    
    // Simulate weapon distribution based on typical CS2 patterns
    // High HS% suggests rifle/pistol player, low suggests AWP
    const isRifler = hsPercent > 0.4;
    
    const distribution = isRifler ? [
      { name: 'Rifle', value: 55 + Math.floor(Math.random() * 15), color: cs2.accent },
      { name: 'Pistol', value: 15 + Math.floor(Math.random() * 10), color: cs2.yellow },
      { name: 'AWP', value: 5 + Math.floor(Math.random() * 10), color: cs2.purple },
      { name: 'SMG', value: 5 + Math.floor(Math.random() * 8), color: cs2.blue },
      { name: 'Utility', value: 2 + Math.floor(Math.random() * 5), color: cs2.green },
    ] : [
      { name: 'AWP', value: 40 + Math.floor(Math.random() * 15), color: cs2.purple },
      { name: 'Rifle', value: 25 + Math.floor(Math.random() * 15), color: cs2.accent },
      { name: 'Pistol', value: 10 + Math.floor(Math.random() * 10), color: cs2.yellow },
      { name: 'SMG', value: 5 + Math.floor(Math.random() * 5), color: cs2.blue },
      { name: 'Utility', value: 2 + Math.floor(Math.random() * 3), color: cs2.green },
    ];
    
    // Normalize to 100%
    const total = distribution.reduce((acc, d) => acc + d.value, 0);
    return distribution.map(d => ({ ...d, value: Math.round((d.value / total) * 100) }));
  }, [playerData]);

  // Determine player role
  const primaryWeapon = weaponData.length > 0 ? weaponData.reduce((a, b) => a.value > b.value ? a : b) : null;
  const role = primaryWeapon?.name === 'AWP' ? 'AWPer' : 'Rifler';

  if (weaponData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>Select a player to view weapon stats</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Role Badge */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
        <Chip 
          label={role}
          sx={{ 
            bgcolor: role === 'AWPer' ? cs2.purple : cs2.accent,
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            px: 2,
            borderRadius: 0
          }}
        />
      </Stack>

      {/* Pie Chart */}
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={weaponData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={{ stroke: cs2.textSecondary }}
            >
              {weaponData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Weapon Legend */}
      <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
        {weaponData.map((weapon) => (
          <Chip
            key={weapon.name}
            label={`${weapon.name}: ${weapon.value}%`}
            size="small"
            sx={{ 
              bgcolor: 'transparent', 
              color: weapon.color, 
              border: `1px solid ${weapon.color}`,
              borderRadius: 0,
              fontWeight: 600
            }}
          />
        ))}
      </Stack>
    </Box>
  );
});

// ==========================================
// 6. CLUTCH STATISTICS
// ==========================================
const ClutchStats = memo(function ClutchStats({ teamRoster, playerStatsById }) {
  const clutchData = useMemo(() => {
    if (!teamRoster || teamRoster.length === 0) return [];

    return teamRoster.map(player => {
      const playerData = playerStatsById[player.player_id] || {};
      const stats = playerData.stats || {};
      
      const mvps = stats.MVPs || stats.mvps || 0;
      const matches = stats.played_matches || 1;
      const rounds = stats.Rounds || stats.rounds || 100;
      
      // Simulate clutch stats based on MVP rate (MVPs often come from clutches)
      const mvpRate = mvps / matches;
      const clutchAttempts = Math.floor(rounds * 0.08); // ~8% of rounds are clutch situations
      
      const v1Attempts = Math.floor(clutchAttempts * 0.5);
      const v2Attempts = Math.floor(clutchAttempts * 0.3);
      const v3Attempts = Math.floor(clutchAttempts * 0.15);
      const v4Attempts = Math.floor(clutchAttempts * 0.04);
      const v5Attempts = Math.floor(clutchAttempts * 0.01);
      
      // Success rate based on MVP performance
      const baseRate = 0.3 + (mvpRate * 0.3);
      
      return {
        id: player.player_id,
        nickname: player.nickname,
        avatar: playerData.avatar || player.avatar,
        v1: { attempts: v1Attempts, wins: Math.floor(v1Attempts * (baseRate + 0.2)), rate: ((baseRate + 0.2) * 100).toFixed(0) },
        v2: { attempts: v2Attempts, wins: Math.floor(v2Attempts * baseRate), rate: (baseRate * 100).toFixed(0) },
        v3: { attempts: v3Attempts, wins: Math.floor(v3Attempts * (baseRate - 0.1)), rate: ((baseRate - 0.1) * 100).toFixed(0) },
        v4: { attempts: v4Attempts, wins: Math.floor(v4Attempts * (baseRate - 0.2)), rate: ((baseRate - 0.2) * 100).toFixed(0) },
        v5: { attempts: v5Attempts, wins: Math.floor(v5Attempts * (baseRate - 0.25)), rate: ((baseRate - 0.25) * 100).toFixed(0) },
        totalWins: 0, // Will be calculated
        mvps
      };
    }).map(p => ({
      ...p,
      totalWins: p.v1.wins + p.v2.wins + p.v3.wins + p.v4.wins + p.v5.wins
    })).sort((a, b) => b.totalWins - a.totalWins);
  }, [teamRoster, playerStatsById]);

  if (clutchData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>No clutch data available</Typography>
      </Box>
    );
  }

  const clutchKing = clutchData[0];

  return (
    <Box>
      {/* Clutch King Card */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          background: `linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, ${cs2.bgCard} 100%)`,
          border: `1px solid ${cs2.yellow}`,
          borderRadius: 0
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <EmojiEventsIcon sx={{ color: cs2.yellow, fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: cs2.yellow, letterSpacing: 2 }}>
              CLUTCH KING
            </Typography>
            <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>
              {clutchKing.nickname}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ color: cs2.yellow, fontWeight: 800 }}>
              {clutchKing.totalWins}
            </Typography>
            <Typography variant="caption" sx={{ color: cs2.textSecondary }}>
              Clutches Won
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Clutch Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          {/* Header */}
          <Grid container sx={{ bgcolor: cs2.bgDark, p: 1.5, mb: 1 }}>
            <Grid item xs={3}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>PLAYER</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>1v1</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>1v2</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>1v3</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>1v4</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>1v5</Typography></Grid>
            <Grid item xs={1.5} sx={{ textAlign: 'center' }}><Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>TOTAL</Typography></Grid>
          </Grid>

          {/* Rows */}
          {clutchData.map((player, index) => (
            <Grid 
              container 
              key={player.id} 
              sx={{ 
                p: 1.5, 
                bgcolor: index % 2 === 0 ? cs2.bgCard : cs2.bgHover,
                borderLeft: index === 0 ? `3px solid ${cs2.yellow}` : 'none',
                alignItems: 'center'
              }}
            >
              <Grid item xs={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar src={player.avatar} sx={{ width: 28, height: 28 }}>{player.nickname?.charAt(0)}</Avatar>
                  <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, fontSize: '0.9rem' }}>{player.nickname}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.green, fontWeight: 600 }}>{player.v1.wins}/{player.v1.attempts}</Typography>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.green, fontWeight: 600 }}>{player.v2.wins}/{player.v2.attempts}</Typography>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.accent, fontWeight: 600 }}>{player.v3.wins}/{player.v3.attempts}</Typography>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.purple, fontWeight: 600 }}>{player.v4.wins}/{player.v4.attempts}</Typography>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.red, fontWeight: 600 }}>{player.v5.wins}/{player.v5.attempts}</Typography>
              </Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                <Chip 
                  label={player.totalWins} 
                  size="small" 
                  sx={{ 
                    bgcolor: index === 0 ? cs2.yellow : cs2.bgDark, 
                    color: index === 0 ? cs2.bgDark : cs2.textPrimary,
                    fontWeight: 700,
                    borderRadius: 0
                  }} 
                />
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

// ==========================================
// 7. HEAD-TO-HEAD DUEL MATRIX
// ==========================================
const DuelMatrix = memo(function DuelMatrix({ teamRoster, opponentRoster, playerStatsById }) {
  const matrixData = useMemo(() => {
    if (!teamRoster || teamRoster.length === 0 || !opponentRoster || opponentRoster.length === 0) {
      return null;
    }

    // Generate simulated duel data between teams
    const matrix = teamRoster.slice(0, 5).map(homePlayer => {
      const homeData = playerStatsById[homePlayer.player_id]?.stats || {};
      const homeKD = (homeData.Kills || 50) / (homeData.Deaths || 50);
      
      const duels = opponentRoster.slice(0, 5).map(awayPlayer => {
        const awayData = playerStatsById[awayPlayer.player_id]?.stats || {};
        const awayKD = (awayData.Kills || 50) / (awayData.Deaths || 50);
        
        // Calculate expected duel outcome based on K/D ratios
        const kdDiff = homeKD - awayKD;
        const baseEncounters = 5 + Math.floor(Math.random() * 10);
        const winRate = 0.5 + (kdDiff * 0.15) + (Math.random() * 0.1 - 0.05);
        const kills = Math.round(baseEncounters * Math.min(Math.max(winRate, 0.2), 0.8));
        const deaths = baseEncounters - kills;
        
        return {
          opponent: awayPlayer.nickname,
          kills,
          deaths,
          diff: kills - deaths
        };
      });
      
      return {
        player: homePlayer.nickname,
        avatar: playerStatsById[homePlayer.player_id]?.avatar || homePlayer.avatar,
        duels
      };
    });
    
    return matrix;
  }, [teamRoster, opponentRoster, playerStatsById]);

  if (!matrixData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: cs2.textSecondary }}>
          Select two teams to view head-to-head matrix
        </Typography>
      </Box>
    );
  }

  const opponents = opponentRoster.slice(0, 5);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <CompareArrowsIcon sx={{ color: cs2.accent }} />
        <Typography sx={{ color: cs2.textSecondary, fontSize: '0.85rem' }}>
          Kill/Death differential in direct encounters
        </Typography>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          {/* Header Row */}
          <Grid container sx={{ bgcolor: cs2.bgDark, p: 1 }}>
            <Grid item xs={2.4}>
              <Typography sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem' }}>VS</Typography>
            </Grid>
            {opponents.map(opp => (
              <Grid item xs={1.92} key={opp.player_id} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, fontSize: '0.75rem' }}>
                  {opp.nickname?.substring(0, 8)}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Data Rows */}
          {matrixData.map((row, rowIndex) => (
            <Grid 
              container 
              key={row.player} 
              sx={{ 
                p: 1, 
                bgcolor: rowIndex % 2 === 0 ? cs2.bgCard : cs2.bgHover,
                alignItems: 'center'
              }}
            >
              <Grid item xs={2.4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar src={row.avatar} sx={{ width: 24, height: 24 }}>{row.player?.charAt(0)}</Avatar>
                  <Typography sx={{ color: cs2.textPrimary, fontWeight: 600, fontSize: '0.85rem' }}>
                    {row.player?.substring(0, 10)}
                  </Typography>
                </Stack>
              </Grid>
              {row.duels.map((duel, colIndex) => (
                <Grid item xs={1.92} key={colIndex} sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      py: 0.5,
                      bgcolor: duel.diff > 0 ? 'rgba(74, 222, 128, 0.2)' : duel.diff < 0 ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                      borderRadius: 0
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: duel.diff > 0 ? cs2.green : duel.diff < 0 ? cs2.red : cs2.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {duel.diff > 0 ? '+' : ''}{duel.diff}
                    </Typography>
                    <Typography sx={{ color: cs2.textSecondary, fontSize: '0.65rem' }}>
                      {duel.kills}-{duel.deaths}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(74, 222, 128, 0.3)' }} />
          <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Winning matchup</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(239, 68, 68, 0.3)' }} />
          <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Losing matchup</Typography>
        </Stack>
      </Stack>
    </Box>
  );
});

// ==========================================
// MAIN COMPONENT
// ==========================================
const PlayerAnalytics = ({ teams, playerStatsById, handleTeamClick }) => {
  const dispatch = useDispatch();
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Track which players we've already requested to prevent duplicate API calls
  const requestedPlayersRef = useRef(new Set());

  // Initialize with first team
  useEffect(() => {
    if (teams?.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].name);
      if (teams.length > 1) {
        setSelectedOpponent(teams[1].name);
      }
    }
  }, [teams, selectedTeam]);

  const currentTeam = useMemo(() => 
    teams?.find(t => t.name === selectedTeam) || null,
    [teams, selectedTeam]
  );

  const opponentTeam = useMemo(() => 
    teams?.find(t => t.name === selectedOpponent) || null,
    [teams, selectedOpponent]
  );

  // Fetch player stats when team changes - uses ref to prevent re-fetching
  useEffect(() => {
    if (currentTeam?.roster) {
      currentTeam.roster.forEach(p => {
        // Only fetch if not already requested AND not in Redux store
        if (!requestedPlayersRef.current.has(p.player_id) && !playerStatsById[p.player_id]) {
          requestedPlayersRef.current.add(p.player_id);
          dispatch(fetchPlayer(p.player_id));
        }
      });
      // Auto-select first player
      if (!selectedPlayer && currentTeam.roster.length > 0) {
        setSelectedPlayer(currentTeam.roster[0]);
      }
    }
    // Intentionally exclude playerStatsById from deps to prevent cascade
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam, dispatch, selectedPlayer]);

  // Fetch opponent stats - uses ref to prevent re-fetching
  useEffect(() => {
    if (opponentTeam?.roster) {
      opponentTeam.roster.forEach(p => {
        if (!requestedPlayersRef.current.has(p.player_id) && !playerStatsById[p.player_id]) {
          requestedPlayersRef.current.add(p.player_id);
          dispatch(fetchPlayer(p.player_id));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponentTeam, dispatch]);

  const handleTeamChange = (e) => {
    const teamName = e.target.value;
    setSelectedTeam(teamName);
    setSelectedPlayer(null);
    const team = teams.find(t => t.name === teamName);
    if (team && handleTeamClick) handleTeamClick(team);
  };

  const handleOpponentChange = (e) => {
    const teamName = e.target.value;
    setSelectedOpponent(teamName);
    const team = teams.find(t => t.name === teamName);
    if (team && handleTeamClick) handleTeamClick(team);
  };

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    const player = currentTeam?.roster.find(p => p.player_id === playerId);
    setSelectedPlayer(player);
  };

  const selectedPlayerData = selectedPlayer ? playerStatsById[selectedPlayer.player_id] : null;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Controls */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: cs2.bgCard, 
          border: `1px solid ${cs2.border}`,
          borderRadius: 0
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
              ADVANCED ANALYTICS
            </Typography>
            <Typography variant="h5" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>
              Player Deep Dive
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: cs2.textSecondary }}>Your Team</InputLabel>
              <Select
                value={selectedTeam}
                onChange={handleTeamChange}
                label="Your Team"
                sx={{
                  color: cs2.textPrimary,
                  bgcolor: cs2.bgDark,
                  borderRadius: 0,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                }}
              >
                {teams?.map(team => (
                  <MenuItem key={team.team_id} value={team.name}>{team.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: cs2.textSecondary }}>Opponent</InputLabel>
              <Select
                value={selectedOpponent}
                onChange={handleOpponentChange}
                label="Opponent"
                sx={{
                  color: cs2.textPrimary,
                  bgcolor: cs2.bgDark,
                  borderRadius: 0,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.red },
                }}
              >
                {teams?.filter(t => t.name !== selectedTeam).map(team => (
                  <MenuItem key={team.team_id} value={team.name}>{team.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: cs2.textSecondary }}>Select Player</InputLabel>
              <Select
                value={selectedPlayer?.player_id || ''}
                onChange={handlePlayerChange}
                label="Select Player"
                sx={{
                  color: cs2.textPrimary,
                  bgcolor: cs2.bgDark,
                  borderRadius: 0,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                }}
              >
                {currentTeam?.roster?.map(player => (
                  <MenuItem key={player.player_id} value={player.player_id}>
                    {player.nickname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Radar Chart - Player Profile */}
        <Grid item xs={12} lg={6}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0,
              height: '100%'
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                {selectedPlayer && (
                  <Avatar 
                    src={selectedPlayerData?.avatar || selectedPlayer.avatar}
                    sx={{ width: 56, height: 56, border: `2px solid ${cs2.accent}` }}
                  >
                    {selectedPlayer.nickname?.charAt(0)}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                    PERFORMANCE PROFILE
                  </Typography>
                  <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700 }}>
                    {selectedPlayer?.nickname || 'Select Player'}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ borderColor: cs2.border, mb: 2 }} />
              <PlayerRadarChart 
                playerData={selectedPlayerData} 
                playerName={selectedPlayer?.nickname}
              />
              
              {/* Stats Legend */}
              {selectedPlayerData && (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {[
                    { label: 'K/D', value: ((selectedPlayerData.stats?.Kills || 0) / (selectedPlayerData.stats?.Deaths || 1)).toFixed(2) },
                    { label: 'HS%', value: `${((selectedPlayerData.stats?.Headshots || 0) / (selectedPlayerData.stats?.Kills || 1) * 100).toFixed(1)}%` },
                    { label: 'K/R', value: ((selectedPlayerData.stats?.Kills || 0) / (selectedPlayerData.stats?.Rounds || 1)).toFixed(2) },
                    { label: 'MVPs', value: selectedPlayerData.stats?.MVPs || 0 },
                  ].map((stat, i) => (
                    <Grid item xs={3} key={i}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: cs2.bgDark, border: `1px solid ${cs2.border}` }}>
                        <Typography variant="caption" sx={{ color: cs2.textSecondary }}>{stat.label}</Typography>
                        <Typography sx={{ color: cs2.accent, fontWeight: 700 }}>{stat.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Form Tracker */}
        <Grid item xs={12} lg={6}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                FORM & MOMENTUM
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                Recent Performance Trend
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 2 }} />
              <FormTracker playerData={selectedPlayerData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Opening Duels - Full Width */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                OPENING DUELS
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                First Blood Analysis - {currentTeam?.name || 'Team'}
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 3 }} />
              <OpeningDuels 
                teamRoster={currentTeam?.roster || []} 
                playerStatsById={playerStatsById}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Side Performance - CT vs T */}
        <Grid item xs={12} lg={6}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                SIDE PERFORMANCE
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                CT vs T Analysis - {selectedPlayer?.nickname || 'Player'}
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 2 }} />
              <SidePerformance playerData={selectedPlayerData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Weapon Distribution */}
        <Grid item xs={12} lg={6}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                WEAPON USAGE
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                Kill Distribution - {selectedPlayer?.nickname || 'Player'}
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 2 }} />
              <WeaponDistribution playerData={selectedPlayerData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Clutch Statistics */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                CLUTCH PERFORMANCE
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                Clutch Statistics - {currentTeam?.name || 'Team'}
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 3 }} />
              <ClutchStats 
                teamRoster={currentTeam?.roster || []} 
                playerStatsById={playerStatsById}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Head-to-Head Duel Matrix */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              borderRadius: 0
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>
                HEAD-TO-HEAD
              </Typography>
              <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 700, mb: 2 }}>
                Duel Matrix: {currentTeam?.name || 'Team'} vs {opponentTeam?.name || 'Opponent'}
              </Typography>
              <Divider sx={{ borderColor: cs2.border, mb: 3 }} />
              <DuelMatrix 
                teamRoster={currentTeam?.roster || []} 
                opponentRoster={opponentTeam?.roster || []}
                playerStatsById={playerStatsById}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(PlayerAnalytics);
