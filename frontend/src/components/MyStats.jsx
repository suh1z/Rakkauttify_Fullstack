/* eslint-disable react/prop-types */
import { useEffect, useMemo, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Security as ShieldIcon,
  Gavel as GavelIcon,
  MilitaryTech as MedalIcon,
  Whatshot as WhatshotIcon,
  Check as CheckIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartOutlineIcon,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
} from 'recharts';
import { initializePlayers, initializePlayerStats, initializePlayerStatsBySteamId, initializeMatches, initializeMatch } from '../reducers/statsReducer';
import { fetchLikedMatches, likeMatch, unlikeMatch, fetchMyProfile, updateMyProfile } from '../reducers/userReducer';
import MatchStats from './MatchStats';

// CS2 Color Palette
const cs2Colors = {
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
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
  purple: '#a855f7',
  blue: '#3b82f6',
};

// Username to in-game nickname mapping (for users with different aliases)
// Keys should be lowercase for case-insensitive matching
const usernameAliases = {
  'zooze': 'Turkulainen',
  // Add more mappings here as needed: 'username': 'ingameNickname'
};

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', description: 'Play your first match', icon: 'gavel', tier: 'bronze' },
  { id: 'headhunter', name: 'Headhunter', description: 'Achieve 50%+ headshot percentage', icon: 'target', tier: 'silver' },
  { id: 'terminator', name: 'Terminator', description: 'Get 1.5+ K/D ratio', icon: 'fire', tier: 'gold' },
  { id: 'veteran', name: 'Veteran', description: 'Play 50+ matches', icon: 'medal', tier: 'silver' },
  { id: 'centurion', name: 'Centurion', description: 'Play 100+ matches', icon: 'trophy', tier: 'gold' },
  { id: 'hot_streak', name: 'Hot Streak', description: 'Win 5 matches in a row', icon: 'fire', tier: 'silver' },
  { id: 'consistent', name: 'Consistent', description: 'Maintain 1.0+ K/D for 10 matches', icon: 'chart', tier: 'silver' },
  { id: 'damage_dealer', name: 'Damage Dealer', description: 'Average 80+ ADR', icon: 'fire', tier: 'silver' },
];

const tierColors = {
  bronze: cs2Colors.bronze,
  silver: cs2Colors.silver,
  gold: cs2Colors.gold,
};

const getAchievementIcon = (icon) => {
  const icons = {
    gavel: <GavelIcon />,
    target: <TrophyIcon />,
    fire: <FireIcon />,
    star: <StarIcon />,
    shield: <ShieldIcon />,
    medal: <MedalIcon />,
    trophy: <TrophyIcon />,
    chart: <TrendingUpIcon />,
  };
  return icons[icon] || <TrophyIcon />;
};

// Stats card component
const StatCard = memo(function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <Card sx={{
      bgcolor: cs2Colors.bgCard,
      border: `1px solid ${cs2Colors.border}`,
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.2s',
      '&:hover': { 
        bgcolor: cs2Colors.bgHover,
        borderColor: color || cs2Colors.accent,
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: cs2Colors.textSecondary, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ 
              color: color || cs2Colors.textPrimary, 
              fontWeight: 700,
              fontFamily: 'monospace',
            }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: cs2Colors.textSecondary }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            color: color || cs2Colors.accent, 
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

// Achievement card
const AchievementCard = memo(function AchievementCard({ achievement, unlocked }) {
  const tierColor = tierColors[achievement.tier] || cs2Colors.bronze;
  
  return (
    <Tooltip title={unlocked ? 'Unlocked!' : 'Not yet unlocked'}>
      <Card sx={{
        bgcolor: unlocked ? cs2Colors.bgCard : 'rgba(26,26,26,0.5)',
        border: `1px solid ${unlocked ? tierColor : cs2Colors.border}`,
        borderRadius: 2,
        opacity: unlocked ? 1 : 0.5,
        transition: 'all 0.3s',
        position: 'relative',
        '&:hover': unlocked ? { 
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${tierColor}40`,
        } : {},
      }}>
        {unlocked && (
          <Box sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            bgcolor: tierColor,
            borderRadius: '50%',
            p: 0.5,
            display: 'flex',
          }}>
            <CheckIcon sx={{ fontSize: 14, color: '#000' }} />
          </Box>
        )}
        <CardContent sx={{ p: 2, textAlign: 'center' }}>
          <Box sx={{ 
            color: unlocked ? tierColor : cs2Colors.textSecondary,
            mb: 1,
            '& svg': { fontSize: 36 }
          }}>
            {getAchievementIcon(achievement.icon)}
          </Box>
          <Typography variant="body2" sx={{ 
            color: unlocked ? cs2Colors.textPrimary : cs2Colors.textSecondary,
            fontWeight: 600,
            mb: 0.5,
          }}>
            {achievement.name}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: cs2Colors.textSecondary,
            display: 'block',
            lineHeight: 1.3,
          }}>
            {achievement.description}
          </Typography>
          <Chip 
            label={achievement.tier.toUpperCase()}
            size="small"
            sx={{ 
              mt: 1,
              bgcolor: `${tierColor}20`,
              color: tierColor,
              fontWeight: 600,
              fontSize: '0.65rem',
              height: 20,
            }}
          />
        </CardContent>
      </Card>
    </Tooltip>
  );
});

// Main MyStats Component
function MyStats() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const players = useSelector(state => state.stats.players);
  const playerStats = useSelector(state => state.stats.playerStats);
  const allMatches = useSelector(state => state.stats.matches);
  const likedMatches = useSelector(state => state.user.likedMatches);
  
  // Dialog state for viewing match details
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Steam ID linking state
  const [steamIdInput, setSteamIdInput] = useState('');
  const [steamIdSaving, setSteamIdSaving] = useState(false);

  // Get user profile which contains steamId
  const profile = useSelector(state => state.user.profile);

  // Get the player nickname for the logged-in user (fallback when no steamId)
  const playerNickname = useMemo(() => {
    if (!user?.username) return null;
    const username = user.username.toLowerCase();
    // Check if there's an alias mapping
    if (usernameAliases[username]) {
      return usernameAliases[username];
    }
    // Otherwise, try to find direct match in players list
    const matchingPlayer = players.find(
      p => p.nickname?.toLowerCase() === username
    );
    return matchingPlayer?.nickname || null;
  }, [user, players]);

  // Get matches from playerStats
  const matches = useMemo(() => {
    return Array.isArray(playerStats?.details) ? [...playerStats.details] : [];
  }, [playerStats]);

  // Fetch players list and user profile on mount
  useEffect(() => {
    dispatch(initializePlayers());
    dispatch(initializeMatches());
    if (user) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, user]);

  // Fetch liked matches when user logs in
  useEffect(() => {
    if (user?.username) {
      dispatch(fetchLikedMatches());
    }
  }, [dispatch, user?.username]);

  // Auto-fetch stats - prefer steamId, fall back to nickname
  useEffect(() => {
    if (profile?.steamId) {
      // Use Steam ID for reliable matching
      dispatch(initializePlayerStatsBySteamId(profile.steamId));
    } else if (playerNickname) {
      // Fall back to nickname matching
      dispatch(initializePlayerStats(playerNickname));
    }
  }, [profile?.steamId, playerNickname, dispatch]);

  // Initialize steam ID input from profile
  useEffect(() => {
    if (profile?.steamId) {
      setSteamIdInput(profile.steamId);
    }
  }, [profile?.steamId]);

  // Handle saving Steam ID
  const handleSaveSteamId = async () => {
    if (!steamIdInput.trim()) return;
    setSteamIdSaving(true);
    try {
      await dispatch(updateMyProfile({ steamId: steamIdInput.trim() }));
    } catch (error) {
      console.error('Failed to save Steam ID:', error);
    } finally {
      setSteamIdSaving(false);
    }
  };


  // Calculate aggregate stats
  const stats = useMemo(() => {
    if (matches.length === 0) return null;

    const totalMatches = matches.length;
    const wins = matches.filter(m => m.win).length;
    const totalKills = matches.reduce((sum, m) => sum + (parseInt(m.kills) || 0), 0);
    const totalDeaths = matches.reduce((sum, m) => sum + (parseInt(m.deaths) || 0), 0);
    const totalAssists = matches.reduce((sum, m) => sum + (parseInt(m.assists) || 0), 0);
    // Use headshotKills field from formatted data
    const totalHSKills = matches.reduce((sum, m) => sum + (parseInt(m.headshotKills) || 0), 0);
    
    // Use pre-calculated ADR from each match (average of all matches)
    const totalAdr = matches.reduce((sum, m) => sum + (parseFloat(m.adr) || 0), 0);
    const avgAdr = totalMatches > 0 ? totalAdr / totalMatches : 0;

    const kd = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
    const hsPercent = totalKills > 0 ? (totalHSKills / totalKills) * 100 : 0;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

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
    const bestKD = Math.max(...matches.map(m => {
      const k = parseInt(m.kills) || 0;
      const d = parseInt(m.deaths) || 1;
      return k / d;
    }));

    return {
      matches: totalMatches,
      wins,
      losses: totalMatches - wins,
      winRate: winRate.toFixed(1),
      kd: kd.toFixed(2),
      kills: totalKills,
      deaths: totalDeaths,
      assists: totalAssists,
      adr: avgAdr.toFixed(1),
      hsPercent: hsPercent.toFixed(1),
      maxStreak,
      bestKills,
      bestKD: bestKD.toFixed(2),
    };
  }, [matches]);

  // Calculate unlocked achievements
  const unlockedAchievements = useMemo(() => {
    if (!stats) return new Set();
    const unlocked = new Set();

    if (stats.matches >= 1) unlocked.add('first_blood');
    if (parseFloat(stats.hsPercent) >= 50) unlocked.add('headhunter');
    if (parseFloat(stats.kd) >= 1.5) unlocked.add('terminator');
    if (stats.matches >= 50) unlocked.add('veteran');
    if (stats.matches >= 100) unlocked.add('centurion');
    if (stats.maxStreak >= 5) unlocked.add('hot_streak');
    if (parseFloat(stats.kd) >= 1.0 && stats.matches >= 10) unlocked.add('consistent');
    if (parseFloat(stats.adr) >= 80) unlocked.add('damage_dealer');

    return unlocked;
  }, [stats]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!stats) return [];
    return [
      { stat: 'K/D', value: Math.min(parseFloat(stats.kd) * 50, 100) },
      { stat: 'ADR', value: Math.min(parseFloat(stats.adr) / 1.2, 100) },
      { stat: 'HS%', value: parseFloat(stats.hsPercent) },
      { stat: 'Win%', value: parseFloat(stats.winRate) },
      { stat: 'Matches', value: Math.min(stats.matches, 100) },
      { stat: 'Streak', value: Math.min(stats.maxStreak * 10, 100) },
    ];
  }, [stats]);

  // Recent form data
  const formData = useMemo(() => {
    if (matches.length === 0) return [];
    return matches.slice(0, 15).reverse().map((match, idx) => {
      const kills = parseInt(match.kills) || 0;
      const deaths = parseInt(match.deaths) || 1;
      const kd = kills / Math.max(deaths, 1);
      return {
        match: match.map ? match.map.replace('de_', '').substring(0, 5) : `#${idx + 1}`,
        kd: parseFloat(kd.toFixed(2)),
        kills,
        win: match.win ? 1 : 0,
      };
    });
  }, [matches]);

  // Map stats
  const mapStats = useMemo(() => {
    if (matches.length === 0) return [];
    const mapData = {};
    matches.forEach(match => {
      const map = match.map || 'Unknown';
      if (!mapData[map]) {
        mapData[map] = { map, wins: 0, losses: 0, matches: 0 };
      }
      mapData[map].matches++;
      if (match.win) mapData[map].wins++;
      else mapData[map].losses++;
    });
    return Object.values(mapData)
      .map(m => ({ ...m, winRate: ((m.wins / m.matches) * 100).toFixed(0) }))
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 6);
  }, [matches]);

  // Favorite matches - filter all matches by liked IDs
  const favoriteMatches = useMemo(() => {
    if (!allMatches.length || !likedMatches.length) return [];
    return allMatches.filter(match => likedMatches.includes(String(match.matchid)));
  }, [allMatches, likedMatches]);

  // Extract team names from URL
  const extractTeams = (url) => {
    if (!url) return 'Unknown Teams';
    const regex = /team_(.*?)_vs_team_(.*?)(?=\.)/;
    const match = url.match(regex);
    if (match) {
      return `${match[1]} vs ${match[2]}`;
    }
    return 'Unknown Teams';
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e, matchId) => {
    e.stopPropagation(); // Prevent row click
    const id = String(matchId);
    if (likedMatches.includes(id)) {
      dispatch(unlikeMatch(id));
    } else {
      dispatch(likeMatch(id));
    }
  };

  // Handle match row click to open details
  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    dispatch(initializeMatch(match.matchid, match.url));
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(null);
  };

  // Loading state
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="info">Please log in to view your stats dashboard.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            color: cs2Colors.textPrimary, 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <PersonIcon sx={{ color: cs2Colors.accent }} />
            My Stats
          </Typography>
          <Typography variant="body2" sx={{ color: cs2Colors.textSecondary, mt: 1 }}>
            Your personal performance dashboard
          </Typography>
        </Box>
        

      </Box>

      {!stats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          {!user ? (
            <Alert severity="warning">Please log in to view your stats</Alert>
          ) : playerNickname ? (
            <CircularProgress sx={{ color: cs2Colors.accent }} />
          ) : (
            <Alert severity="info">No player data found for &quot;{user.username}&quot;. Contact admin to add your alias.</Alert>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
              height: '100%',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: cs2Colors.accent,
                  fontSize: 24,
                  fontWeight: 700,
                }}>
                  {playerNickname?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, fontWeight: 600 }}>
                    {playerNickname}
                  </Typography>
                  <Chip 
                    label={`${stats.matches} matches`}
                    size="small"
                    sx={{ bgcolor: `${cs2Colors.accent}20`, color: cs2Colors.accent }}
                  />
                </Box>
              </Box>

              {/* Achievement Progress */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: cs2Colors.textSecondary }}>
                    Achievement Progress
                  </Typography>
                  <Typography variant="body2" sx={{ color: cs2Colors.accent }}>
                    {unlockedAchievements.size}/{ACHIEVEMENTS.length}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(unlockedAchievements.size / ACHIEVEMENTS.length) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: cs2Colors.border,
                    '& .MuiLinearProgress-bar': { bgcolor: cs2Colors.accent, borderRadius: 4 }
                  }}
                />
              </Box>

              {/* Personal Bests */}
              <Typography variant="body2" sx={{ color: cs2Colors.textSecondary, mb: 1 }}>Personal Bests</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: cs2Colors.bgHover, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: cs2Colors.gold, fontWeight: 700 }}>{stats.bestKills}</Typography>
                    <Typography variant="caption" sx={{ color: cs2Colors.textSecondary }}>Most Kills</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: cs2Colors.bgHover, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: cs2Colors.gold, fontWeight: 700 }}>{stats.bestKD}</Typography>
                    <Typography variant="caption" sx={{ color: cs2Colors.textSecondary }}>Best K/D</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: cs2Colors.bgHover, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: cs2Colors.gold, fontWeight: 700 }}>{stats.maxStreak}</Typography>
                    <Typography variant="caption" sx={{ color: cs2Colors.textSecondary }}>Win Streak</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: cs2Colors.bgHover, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: cs2Colors.gold, fontWeight: 700 }}>{stats.assists}</Typography>
                    <Typography variant="caption" sx={{ color: cs2Colors.textSecondary }}>Total Assists</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Steam ID Linking */}
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${cs2Colors.border}` }}>
                <Typography variant="body2" sx={{ color: cs2Colors.textSecondary, mb: 1 }}>
                  Link Steam ID
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Your Steam64 ID"
                    value={steamIdInput}
                    onChange={(e) => setSteamIdInput(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: cs2Colors.bgHover,
                        color: cs2Colors.textPrimary,
                        '& fieldset': { borderColor: cs2Colors.border },
                        '&:hover fieldset': { borderColor: cs2Colors.accent },
                        '&.Mui-focused fieldset': { borderColor: cs2Colors.accent },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontSize: '0.875rem',
                        '&::placeholder': { color: cs2Colors.textSecondary, opacity: 1 },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveSteamId}
                    disabled={steamIdSaving || !steamIdInput.trim() || steamIdInput === profile?.steamId}
                    sx={{
                      bgcolor: cs2Colors.accent,
                      '&:hover': { bgcolor: cs2Colors.accentHover },
                      '&.Mui-disabled': { bgcolor: cs2Colors.border, color: cs2Colors.textSecondary },
                    }}
                  >
                    {steamIdSaving ? <CircularProgress size={18} /> : 'Save'}
                  </Button>
                </Box>
                {profile?.steamId && (
                  <Typography variant="caption" sx={{ color: cs2Colors.green, mt: 0.5, display: 'block' }}>
                    ✓ Steam ID linked
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Radar Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, mb: 2 }}>
                Performance Profile
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={cs2Colors.border} />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: cs2Colors.textSecondary, fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: cs2Colors.textSecondary, fontSize: 10 }} />
                  <Radar name="Stats" dataKey="value" stroke={cs2Colors.accent} fill={cs2Colors.accent} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={6} sm={3}>
            <StatCard
              title="K/D Ratio"
              value={stats.kd}
              subtitle={`${stats.kills}K / ${stats.deaths}D`}
              icon={<GavelIcon />}
              color={parseFloat(stats.kd) >= 1 ? cs2Colors.green : cs2Colors.red}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              title="Headshot %"
              value={`${stats.hsPercent}%`}
              icon={<WhatshotIcon />}
              color={cs2Colors.accent}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              title="Win Rate"
              value={`${stats.winRate}%`}
              subtitle={`${stats.wins}W / ${stats.losses}L`}
              icon={<TrophyIcon />}
              color={parseFloat(stats.winRate) >= 50 ? cs2Colors.green : cs2Colors.red}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              title="ADR"
              value={stats.adr}
              subtitle="Avg Damage/Round"
              icon={<FireIcon />}
              color={cs2Colors.blue}
            />
          </Grid>

          {/* Recent Form Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: cs2Colors.green }} />
                Recent Form (Last 15 Matches)
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={formData}>
                  <defs>
                    <linearGradient id="formGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cs2Colors.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={cs2Colors.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={cs2Colors.border} />
                  <XAxis dataKey="match" tick={{ fill: cs2Colors.textSecondary, fontSize: 10 }} />
                  <YAxis tick={{ fill: cs2Colors.textSecondary, fontSize: 10 }} domain={[0, 'auto']} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: cs2Colors.bgCard, border: `1px solid ${cs2Colors.border}`, borderRadius: 8 }}
                  />
                  <Area type="monotone" dataKey="kd" stroke={cs2Colors.accent} fill="url(#formGrad)" strokeWidth={2} name="K/D" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Map Performance */}
          <Grid item xs={12} md={4}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, mb: 2 }}>
                Map Performance
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mapStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={cs2Colors.border} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: cs2Colors.textSecondary, fontSize: 10 }} />
                  <YAxis dataKey="map" type="category" tick={{ fill: cs2Colors.textSecondary, fontSize: 10 }} width={60} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: cs2Colors.bgCard, border: `1px solid ${cs2Colors.border}`, borderRadius: 8 }}
                    formatter={(value) => [`${value}%`, 'Win Rate']}
                  />
                  <Bar dataKey="winRate" fill={cs2Colors.accent} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Achievements Grid */}
          <Grid item xs={12}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, mb: 3 }}>
                <TrophyIcon sx={{ mr: 1, verticalAlign: 'middle', color: cs2Colors.accent }} />
                Achievements
              </Typography>
              <Grid container spacing={2}>
                {ACHIEVEMENTS.map(achievement => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={achievement.id}>
                    <AchievementCard 
                      achievement={achievement}
                      unlocked={unlockedAchievements.has(achievement.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Favorite Matches */}
          <Grid item xs={12}>
            <Paper sx={{
              bgcolor: cs2Colors.bgCard,
              border: `1px solid ${cs2Colors.border}`,
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="h6" sx={{ color: cs2Colors.textPrimary, mb: 3 }}>
                <HeartIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#ef4444' }} />
                Favorite Matches ({favoriteMatches.length})
              </Typography>
              {favoriteMatches.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HeartOutlineIcon sx={{ fontSize: 48, color: cs2Colors.textSecondary, mb: 2 }} />
                  <Typography sx={{ color: cs2Colors.textSecondary }}>
                    No favorites yet. Click the heart icon on matches to save them here!
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: cs2Colors.textSecondary, borderColor: cs2Colors.border }}>Date</TableCell>
                        <TableCell sx={{ color: cs2Colors.textSecondary, borderColor: cs2Colors.border }}>Teams</TableCell>
                        <TableCell sx={{ color: cs2Colors.textSecondary, borderColor: cs2Colors.border }}>Map</TableCell>
                        <TableCell sx={{ color: cs2Colors.textSecondary, borderColor: cs2Colors.border }} align="center">Remove</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {favoriteMatches.map(match => (
                        <TableRow 
                          key={match.matchid}
                          onClick={() => handleMatchClick(match)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: cs2Colors.bgHover },
                            borderBottom: `1px solid ${cs2Colors.border}`,
                          }}
                        >
                          <TableCell sx={{ color: cs2Colors.textPrimary, borderColor: cs2Colors.border }}>
                            {match.date}
                          </TableCell>
                          <TableCell sx={{ color: cs2Colors.textPrimary, fontWeight: 600, borderColor: cs2Colors.border }}>
                            {extractTeams(match.url)}
                          </TableCell>
                          <TableCell sx={{ borderColor: cs2Colors.border }}>
                            <Typography sx={{ color: cs2Colors.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                              {match.map?.replace('de_', '').replace('cs_', '')}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ borderColor: cs2Colors.border }}>
                            <Tooltip title="Remove from favorites">
                              <IconButton
                                onClick={(e) => handleFavoriteToggle(e, match.matchid)}
                                size="small"
                                sx={{ 
                                  color: '#ef4444',
                                  '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' }
                                }}
                              >
                                <HeartIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Match Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { bgcolor: cs2Colors.bgCard, border: `1px solid ${cs2Colors.border}` }
        }}
      >
        <DialogTitle sx={{ color: cs2Colors.accent, textTransform: 'uppercase', letterSpacing: 2 }}>Match Details</DialogTitle>
        <DialogContent>
          {selectedMatch ? (
            <MatchStats matchId={selectedMatch.matchid} url={selectedMatch.url} />
          ) : (
            <Typography variant="body1" sx={{ color: cs2Colors.textSecondary }}>Loading match details...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${cs2Colors.border}` }}>
          <Button onClick={handleCloseDialog} sx={{ color: cs2Colors.accent }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyStats;
