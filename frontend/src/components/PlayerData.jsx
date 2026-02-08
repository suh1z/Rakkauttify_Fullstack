/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  GpsFixed as CrosshairIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Whatshot as WhatshotIcon,
  Star as StarIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { initializePlayerStats, initializePlayers } from '../reducers/statsReducer';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
  purple: '#a855f7',
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: cs2.bgDark, p: 1.5, border: `1px solid ${cs2.border}`, borderRadius: 1 }}>
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

// KPI Stat Card Component
const StatCard = memo(function StatCard({ title, value, subtitle, icon, color, trend, benchmark }) {
  const isBelowBenchmark = benchmark && parseFloat(value) < benchmark;
  const isAboveBenchmark = benchmark && parseFloat(value) >= benchmark;
  
  return (
    <Card sx={{
      bgcolor: cs2.bgCard,
      border: `1px solid ${cs2.border}`,
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'visible',
      '&:hover': {
        bgcolor: cs2.bgHover,
        borderColor: color || cs2.accent,
        transform: 'translateY(-2px)',
      }
    }}>
      {trend && (
        <Chip
          label={trend > 0 ? `+${trend}%` : `${trend}%`}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 10,
            bgcolor: trend > 0 ? cs2.green : cs2.red,
            color: '#000',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 20,
          }}
        />
      )}
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: cs2.textSecondary, mb: 0.5, fontSize: '0.75rem', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{
              color: isAboveBenchmark ? cs2.green : isBelowBenchmark ? cs2.red : (color || cs2.textPrimary),
              fontWeight: 700,
              fontFamily: 'monospace',
            }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: cs2.textSecondary }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{
            color: color || cs2.accent,
            opacity: 0.7,
            '& svg': { fontSize: 32 }
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

// Performance Radar Chart
const PerformanceRadar = memo(function PerformanceRadar({ stats, playerName }) {
  if (!stats) return null;

  const radarData = [
    { stat: 'K/D', value: Math.min((stats.kd / 2.0) * 100, 100), fullMark: 100 },
    { stat: 'HS%', value: Math.min(stats.hsPercent, 100), fullMark: 100 },
    { stat: 'ADR', value: Math.min((stats.adr / 120) * 100, 100), fullMark: 100 },
    { stat: 'Win%', value: stats.winRate, fullMark: 100 },
    { stat: 'Impact', value: Math.min((stats.impactScore / 3) * 100, 100), fullMark: 100 },
    { stat: 'Clutch', value: Math.min((stats.clutchScore / 1.5) * 100, 100), fullMark: 100 },
  ];

  return (
    <Box sx={{ height: 320, width: '100%' }}>
      <ResponsiveContainer>
        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke={cs2.border} />
          <PolarAngleAxis dataKey="stat" tick={{ fill: cs2.textSecondary, fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: cs2.textSecondary, fontSize: 10 }} axisLine={false} />
          <Radar name={playerName} dataKey="value" stroke={cs2.accent} fill={cs2.accent} fillOpacity={0.4} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
});

// Multi-Kill Distribution Pie Chart
const MultiKillChart = memo(function MultiKillChart({ stats }) {
  if (!stats) return null;

  const pieData = [
    { name: '2K', value: stats.doubleKills, color: cs2.green },
    { name: '3K', value: stats.tripleKills, color: cs2.blue },
    { name: '4K', value: stats.quadroKills, color: cs2.purple },
    { name: '5K', value: stats.pentaKills, color: cs2.gold },
  ].filter(d => d.value > 0);

  if (pieData.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <Typography sx={{ color: cs2.textSecondary }}>No multi-kill data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 200, width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={{ stroke: cs2.textSecondary }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
});

// Map Performance Bar Chart
const MapPerformanceChart = memo(function MapPerformanceChart({ mapStats }) {
  if (!mapStats || mapStats.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
        <Typography sx={{ color: cs2.textSecondary }}>No map data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 250, width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={mapStats} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={cs2.border} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: cs2.textSecondary, fontSize: 11 }} />
          <YAxis dataKey="map" type="category" tick={{ fill: cs2.textPrimary, fontSize: 11 }} width={55} />
          <Tooltip content={<CustomTooltip />} formatter={(value) => [`${value}%`, 'Win Rate']} />
          <Bar dataKey="winRate" name="Win Rate %" radius={[0, 4, 4, 0]}>
            {mapStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={parseFloat(entry.winRate) >= 50 ? cs2.green : cs2.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
});

// Performance Trend Chart with K/D and ADR
const PerformanceTrendChart = memo(function PerformanceTrendChart({ matches }) {
  if (!matches || matches.length === 0) return null;

  // Calculate rolling K/D for last 15 matches
  const trendData = matches.slice(-20).map((match, idx) => {
    const kills = parseInt(match.kills) || 0;
    const deaths = parseInt(match.deaths) || 1;
    const kd = kills / deaths;
    const adr = parseFloat(match.adr) || 0;
    const hsp = match.headshotPercentage || (match.headshotKills && match.kills ? (match.headshotKills / match.kills * 100) : 0);
    
    return {
      match: match.map ? match.map.replace('de_', '').substring(0, 6) : `#${idx + 1}`,
      kd: parseFloat(kd.toFixed(2)),
      adr: parseFloat(adr.toFixed(1)),
      hsp: parseFloat(hsp.toFixed(1)),
      win: match.win ? 1 : 0,
    };
  });

  return (
    <Box sx={{ height: 280, width: '100%' }}>
      <ResponsiveContainer>
        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="kdGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={cs2.accent} stopOpacity={0.4} />
              <stop offset="95%" stopColor={cs2.accent} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="adrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={cs2.blue} stopOpacity={0.3} />
              <stop offset="95%" stopColor={cs2.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={cs2.border} />
          <XAxis dataKey="match" tick={{ fill: cs2.textSecondary, fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: cs2.textSecondary, fontSize: 10 }} domain={[0, 'auto']} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: cs2.textSecondary, fontSize: 10 }} domain={[0, 120]} />
          <Tooltip content={<CustomTooltip />} />
          <Area yAxisId="left" type="monotone" dataKey="kd" stroke={cs2.accent} fill="url(#kdGradient)" strokeWidth={2} name="K/D" />
          <Line yAxisId="right" type="monotone" dataKey="adr" stroke={cs2.blue} strokeWidth={2} dot={{ fill: cs2.blue, r: 3 }} name="ADR" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
});

// Compact Match History Table
const MatchHistoryTable = memo(function MatchHistoryTable({ matches }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!matches || matches.length === 0) return null;

  // Sort by date descending
  const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
  const paginatedMatches = sortedMatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: cs2.border } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: cs2.bgDark }}>
              <TableCell sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>DATE</TableCell>
              <TableCell sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>MAP</TableCell>
              <TableCell sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>RESULT</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>K</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>A</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>D</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>K/D</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>ADR</TableCell>
              <TableCell align="center" sx={{ color: cs2.textSecondary, fontWeight: 600, fontSize: '0.75rem', letterSpacing: 1 }}>HS%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMatches.map((match, index) => {
              const kills = parseInt(match.kills) || 0;
              const deaths = parseInt(match.deaths) || 1;
              const assists = parseInt(match.assists) || 0;
              const kd = (kills / deaths).toFixed(2);
              const adr = parseFloat(match.adr || 0).toFixed(1);
              const hsp = match.headshotPercentage || (match.headshotKills && kills ? (match.headshotKills / kills * 100).toFixed(0) : '-');

              return (
                <TableRow key={index} sx={{ bgcolor: index % 2 === 0 ? cs2.bgCard : cs2.bgHover, '&:hover': { bgcolor: cs2.bgHover } }}>
                  <TableCell sx={{ color: cs2.textSecondary, fontSize: '0.85rem' }}>
                    {new Date(match.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: cs2.textPrimary, fontWeight: 500 }}>
                    {(match.map || 'Unknown').replace('de_', '')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={match.win ? 'W' : 'L'}
                      size="small"
                      sx={{
                        bgcolor: match.win ? cs2.green : cs2.red,
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                        minWidth: 28,
                      }}
                    />
                    <Typography component="span" sx={{ ml: 1, color: cs2.textSecondary, fontSize: '0.8rem' }}>
                      {match.score}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ color: cs2.textPrimary, fontWeight: 600 }}>{kills}</TableCell>
                  <TableCell align="center" sx={{ color: cs2.textSecondary }}>{assists}</TableCell>
                  <TableCell align="center" sx={{ color: cs2.textSecondary }}>{deaths}</TableCell>
                  <TableCell align="center" sx={{ color: parseFloat(kd) >= 1 ? cs2.green : cs2.red, fontWeight: 600 }}>{kd}</TableCell>
                  <TableCell align="center" sx={{ color: parseFloat(adr) >= 80 ? cs2.green : cs2.textPrimary }}>{adr}</TableCell>
                  <TableCell align="center" sx={{ color: parseFloat(hsp) >= 50 ? cs2.accent : cs2.textSecondary }}>{hsp}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedMatches.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{ color: cs2.textSecondary, '& .MuiIconButton-root': { color: cs2.textSecondary } }}
      />
    </Box>
  );
});

// Form/Streak Indicator
const FormIndicator = memo(function FormIndicator({ matches }) {
  if (!matches || matches.length < 5) return null;

  const last10 = matches.slice(-10);
  const wins = last10.filter(m => m.win).length;

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {last10.map((match, i) => (
        <MuiTooltip 
          key={i} 
          title={`${match.map?.replace('de_', '')}: ${match.win ? 'Win' : 'Loss'} - K/D: ${(match.kills / (match.deaths || 1)).toFixed(2)}`}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: match.win ? cs2.green : cs2.red,
              borderRadius: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.2)' },
            }}
          >
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#000' }}>
              {match.win ? 'W' : 'L'}
            </Typography>
          </Box>
        </MuiTooltip>
      ))}
      <Chip
        label={`${wins}/10`}
        size="small"
        sx={{ ml: 1, bgcolor: wins >= 5 ? cs2.green : cs2.red, color: '#000', fontWeight: 700 }}
      />
    </Stack>
  );
});

// Main PlayerData Component
const PlayerData = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.stats.players);
  const playerStats = useSelector((state) => state.stats.playerStats);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const matches = useMemo(() => {
    return Array.isArray(playerStats?.details) ? [...playerStats.details] : [];
  }, [playerStats]);

  // Sort matches by date ascending for charts
  const matchesForChart = useMemo(() => {
    return [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [matches]);

  // Calculate aggregate stats
  const aggregateStats = useMemo(() => {
    if (matches.length === 0) return null;

    const totalMatches = matches.length;
    const wins = matches.filter(m => m.win).length;
    const totalKills = matches.reduce((sum, m) => sum + (parseInt(m.kills) || 0), 0);
    const totalDeaths = matches.reduce((sum, m) => sum + (parseInt(m.deaths) || 0), 0);
    const totalAssists = matches.reduce((sum, m) => sum + (parseInt(m.assists) || 0), 0);
    const totalHSKills = matches.reduce((sum, m) => sum + (parseInt(m.headshotKills) || 0), 0);
    const totalAdr = matches.reduce((sum, m) => sum + (parseFloat(m.adr) || 0), 0);
    const totalMVPs = matches.reduce((sum, m) => sum + (parseInt(m.mvps) || 0), 0);
    const totalRounds = matches.reduce((sum, m) => sum + (parseInt(m.rounds) || 0), 0);

    // Multi-kills - field names from scoreUtils.js formatPlayerData
    const doubleKills = matches.reduce((sum, m) => sum + (parseInt(m.enemy2k) || 0), 0);
    const tripleKills = matches.reduce((sum, m) => sum + (parseInt(m.enemy3k) || 0), 0);
    const quadroKills = matches.reduce((sum, m) => sum + (parseInt(m.enemy4k) || 0), 0);
    const pentaKills = matches.reduce((sum, m) => sum + (parseInt(m.enemy5k) || 0), 0);

    const kd = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
    const hsPercent = totalKills > 0 ? (totalHSKills / totalKills) * 100 : 0;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
    const avgAdr = totalMatches > 0 ? totalAdr / totalMatches : 0;
    const kr = totalRounds > 0 ? totalKills / totalRounds : 0;

    // Impact score (multi-kills weighted)
    const impactScore = (doubleKills * 2 + tripleKills * 3 + quadroKills * 4 + pentaKills * 5) / totalMatches;
    // Clutch score (based on MVPs per match)
    const clutchScore = totalMVPs / totalMatches;

    // Calculate win streak
    let currentStreak = 0;
    let maxStreak = 0;
    const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const match of sortedMatches) {
      if (match.win) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Best match stats
    const bestKills = Math.max(...matches.map(m => parseInt(m.kills) || 0));
    const bestKD = Math.max(...matches.map(m => (parseInt(m.kills) || 0) / (parseInt(m.deaths) || 1)));

    return {
      matches: totalMatches,
      wins,
      losses: totalMatches - wins,
      winRate: parseFloat(winRate.toFixed(1)),
      kd: parseFloat(kd.toFixed(2)),
      kills: totalKills,
      deaths: totalDeaths,
      assists: totalAssists,
      adr: parseFloat(avgAdr.toFixed(1)),
      hsPercent: parseFloat(hsPercent.toFixed(1)),
      kr: parseFloat(kr.toFixed(2)),
      maxStreak,
      bestKills,
      bestKD: parseFloat(bestKD.toFixed(2)),
      mvps: totalMVPs,
      rounds: totalRounds,
      doubleKills,
      tripleKills,
      quadroKills,
      pentaKills,
      impactScore: parseFloat(impactScore.toFixed(2)),
      clutchScore: parseFloat(clutchScore.toFixed(2)),
    };
  }, [matches]);

  // Map statistics
  const mapStats = useMemo(() => {
    if (matches.length === 0) return [];
    const mapData = {};
    matches.forEach(match => {
      const map = (match.map || 'Unknown').replace('de_', '');
      if (!mapData[map]) {
        mapData[map] = { map, wins: 0, losses: 0, matches: 0, totalKD: 0 };
      }
      mapData[map].matches++;
      const kd = (parseInt(match.kills) || 0) / (parseInt(match.deaths) || 1);
      mapData[map].totalKD += kd;
      if (match.win) mapData[map].wins++;
      else mapData[map].losses++;
    });
    return Object.values(mapData)
      .map(m => ({
        ...m,
        winRate: ((m.wins / m.matches) * 100).toFixed(0),
        avgKD: (m.totalKD / m.matches).toFixed(2),
      }))
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 7);
  }, [matches]);

  useEffect(() => {
    dispatch(initializePlayers());
  }, [dispatch]);

  const handlePlayerSelect = (event) => {
    const nickname = event.target.value;
    setSelectedPlayer(nickname);
    if (nickname) {
      dispatch(initializePlayerStats(nickname));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: cs2.bgDark, color: cs2.textPrimary }}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 3, fontWeight: 'bold' }}>
            PLAYER ANALYTICS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: cs2.textPrimary }}>
            Performance Dashboard
          </Typography>
        </Box>

        {/* Player Selector */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel id="player-select-label" sx={{ color: cs2.textSecondary }}>Select Player</InputLabel>
              <Select
                labelId="player-select-label"
                value={selectedPlayer}
                onChange={handlePlayerSelect}
                label="Select Player"
                sx={{
                  color: cs2.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                  '& .MuiSvgIcon-root': { color: cs2.textSecondary }
                }}
                MenuProps={{ PaperProps: { sx: { bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` } } }}
              >
                <MenuItem value="" sx={{ color: cs2.textSecondary }}>
                  <em>-- Select a Player --</em>
                </MenuItem>
                {players.map((player) => (
                  <MenuItem key={player.nickname} value={player.nickname} sx={{ color: cs2.textPrimary, '&:hover': { bgcolor: cs2.bgHover } }}>
                    {player.nickname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedPlayer && aggregateStats && (
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: cs2.accent, fontWeight: 700 }}>
                    {selectedPlayer.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: cs2.textPrimary, fontWeight: 600 }}>{selectedPlayer}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`${aggregateStats.matches} matches`} size="small" sx={{ bgcolor: `${cs2.accent}20`, color: cs2.accent }} />
                      <Chip label={`${aggregateStats.rounds} rounds`} size="small" sx={{ bgcolor: `${cs2.blue}20`, color: cs2.blue }} />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}

            {selectedPlayer && matches.length >= 5 && (
              <Box>
                <Typography variant="caption" sx={{ color: cs2.textSecondary, mb: 0.5, display: 'block' }}>RECENT FORM</Typography>
                <FormIndicator matches={matchesForChart} />
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Main Content */}
        {selectedPlayer && aggregateStats ? (
          <Grid container spacing={3}>
            {/* KPI Stat Cards Row */}
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="K/D RATIO" value={aggregateStats.kd} subtitle={`${aggregateStats.kills}K / ${aggregateStats.deaths}D`} icon={<CrosshairIcon />} benchmark={1.0} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="ADR" value={aggregateStats.adr} subtitle="Avg Damage/Round" icon={<FireIcon />} color={cs2.blue} benchmark={80} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="HS%" value={`${aggregateStats.hsPercent}%`} subtitle="Headshot Rate" icon={<WhatshotIcon />} color={cs2.accent} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="WIN RATE" value={`${aggregateStats.winRate}%`} subtitle={`${aggregateStats.wins}W / ${aggregateStats.losses}L`} icon={<TrophyIcon />} benchmark={50} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="K/R" value={aggregateStats.kr} subtitle="Kills per Round" icon={<SpeedIcon />} color={cs2.purple} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard title="MVP RATE" value={(aggregateStats.mvps / aggregateStats.matches).toFixed(2)} subtitle={`${aggregateStats.mvps} total MVPs`} icon={<StarIcon />} color={cs2.gold} />
            </Grid>

            {/* Performance Radar + Multi-Kill Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3 }}>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>SKILL PROFILE</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 1 }}>Performance Radar</Typography>
                <PerformanceRadar stats={aggregateStats} playerName={selectedPlayer} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {/* Multi-Kill Distribution */}
                <Grid item xs={12}>
                  <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3 }}>
                    <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>IMPACT PLAYS</Typography>
                    <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 1 }}>Multi-Kill Distribution</Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Chip label={`2K: ${aggregateStats.doubleKills}`} sx={{ bgcolor: `${cs2.green}20`, color: cs2.green }} />
                      <Chip label={`3K: ${aggregateStats.tripleKills}`} sx={{ bgcolor: `${cs2.blue}20`, color: cs2.blue }} />
                      <Chip label={`4K: ${aggregateStats.quadroKills}`} sx={{ bgcolor: `${cs2.purple}20`, color: cs2.purple }} />
                      <Chip label={`5K: ${aggregateStats.pentaKills}`} sx={{ bgcolor: `${cs2.gold}20`, color: cs2.gold }} />
                    </Stack>
                    <MultiKillChart stats={aggregateStats} />
                  </Paper>
                </Grid>

                {/* Personal Bests */}
                <Grid item xs={12}>
                  <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3 }}>
                    <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>RECORDS</Typography>
                    <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 2 }}>Personal Bests</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: cs2.bgHover, borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h5" sx={{ color: cs2.gold, fontWeight: 700 }}>{aggregateStats.bestKills}</Typography>
                          <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Most Kills</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: cs2.bgHover, borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h5" sx={{ color: cs2.gold, fontWeight: 700 }}>{aggregateStats.bestKD}</Typography>
                          <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Best K/D</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: cs2.bgHover, borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h5" sx={{ color: cs2.gold, fontWeight: 700 }}>{aggregateStats.maxStreak}</Typography>
                          <Typography variant="caption" sx={{ color: cs2.textSecondary }}>Win Streak</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Performance Trend Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3 }}>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>TREND ANALYSIS</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: cs2.green }} />
                  Performance Trends (Last 20 Matches)
                </Typography>
                <PerformanceTrendChart matches={matchesForChart} />
              </Paper>
            </Grid>

            {/* Map Performance */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3, height: '100%' }}>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>MAP PERFORMANCE</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 1 }}>
                  <MapIcon sx={{ mr: 1, verticalAlign: 'middle', color: cs2.blue }} />
                  Win Rate by Map
                </Typography>
                <MapPerformanceChart mapStats={mapStats} />
              </Paper>
            </Grid>

            {/* Compact Match History Table */}
            <Grid item xs={12}>
              <Paper sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, borderRadius: 2, p: 3 }}>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>MATCH HISTORY</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 2 }}>Recent Matches</Typography>
                <MatchHistoryTable matches={matches} />
              </Paper>
            </Grid>
          </Grid>
        ) : selectedPlayer ? (
          <Paper sx={{ p: 4, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: cs2.textSecondary }}>
              Loading match data for {selectedPlayer}...
            </Typography>
            <LinearProgress sx={{ mt: 2, bgcolor: cs2.border, '& .MuiLinearProgress-bar': { bgcolor: cs2.accent } }} />
          </Paper>
        ) : (
          <Paper sx={{ p: 4, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, textAlign: 'center' }}>
            <CrosshairIcon sx={{ fontSize: 64, color: cs2.textSecondary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: cs2.textSecondary }}>
              Select a player above to view their analytics dashboard
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PlayerData;
