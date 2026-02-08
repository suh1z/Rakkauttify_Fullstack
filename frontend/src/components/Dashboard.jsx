import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Container, IconButton, Tooltip, Chip } from '@mui/material';
import { Favorite as HeartIcon, FavoriteBorder as HeartOutlineIcon } from '@mui/icons-material';
import { initializeMatches, initializePlayers, initializeMonths, initializeMatch } from '../reducers/statsReducer';
import { likeMatch, unlikeMatch, fetchLikedMatches } from '../reducers/userReducer';
import userService from '../services/userService';
import MatchStats from './MatchStats';

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
};

// Map background images (add images to public/maps/)
const mapImages = {
  de_dust2: '/maps/dust2.png',
  de_mirage: '/maps/mirage.png',
  de_inferno: '/maps/inferno.png',
  de_nuke: '/maps/nuke.png',
  de_overpass: '/maps/overpass.png',
  de_ancient: '/maps/ancient.png',
  de_anubis: '/maps/anubis.png',
  de_vertigo: '/maps/vertigo.png',
  cs_office: '/maps/office.png',
  de_train: '/maps/train.png',
  de_cache: '/maps/cache.png',
};

const getMapImage = (mapName) => {
  if (!mapName) return null;
  const key = mapName.toLowerCase().replace(/\s/g, '_');
  return mapImages[key] || mapImages[`de_${key}`] || null;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const isLiking = useRef(false);

  const matches = useSelector((state) => state.stats.matches);
  const players = useSelector((state) => state.stats.players);
  const months = useSelector((state) => state.stats.months);
  const user = useSelector((state) => state.user.user);
  const likedMatches = useSelector((state) => state.user.likedMatches);

  useEffect(() => {
    dispatch(initializeMatches());
    dispatch(initializePlayers());
    dispatch(initializeMonths());
  }, [dispatch]);

  // Fetch like counts for all matches (public)
  useEffect(() => {
    const fetchLikeCounts = async () => {
      if (matches.length > 0) {
        try {
          const matchIds = matches.map(m => String(m.matchid));
          const counts = await userService.getMatchLikeCounts(matchIds);
          setLikeCounts(counts);
        } catch (error) {
          console.error('Failed to fetch like counts:', error);
        }
      }
    };
    fetchLikeCounts();
  }, [matches.length]);

  // Fetch user's liked matches on login (only when username changes)
  useEffect(() => {
    if (user?.username && !isLiking.current) {
      dispatch(fetchLikedMatches());
    }
  }, [dispatch, user?.username]);

  const handleLikeClick = async (e, matchId) => {
    e.stopPropagation();
    if (!user) return;
    
    const id = String(matchId);
    const hasLiked = likedMatches.includes(id);
    
    isLiking.current = true;
    
    if (hasLiked) {
      dispatch(unlikeMatch(id));
      // Update local count
      setLikeCounts(prev => ({
        ...prev,
        [id]: {
          count: Math.max((prev[id]?.count || 1) - 1, 0),
          users: (prev[id]?.users || []).filter(u => u.username !== user.username),
        }
      }));
    } else {
      dispatch(likeMatch(id));
      // Update local count
      setLikeCounts(prev => ({
        ...prev,
        [id]: {
          count: (prev[id]?.count || 0) + 1,
          users: [...(prev[id]?.users || []), { username: user.username, name: user.name }],
        }
      }));
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isLiking.current = false;
    }, 500);
  };

  const handleRowClick = (match) => {
    setSelectedMatch(match);
    dispatch(initializeMatch(match.matchid, match.url));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(null);
  };

  const extractTeams = (url) => {
    const regex = /team_(.*?)_vs_team_(.*?)(?=\.)/;
    const match = url.match(regex);
    if (match) {
      return `${match[1]} vs ${match[2]}`;
    }
    return 'Unknown Teams';
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: cs2.bgDark, color: cs2.textPrimary, pb: 4 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 3, fontWeight: 'bold' }}>
            INHOUSE STATS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: cs2.textPrimary }}>
            Rakkauden Kanaali
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: cs2.textSecondary, letterSpacing: 2 }}>Total Matches</Typography>
                <Typography variant="h3" sx={{ color: cs2.accent, fontWeight: 800 }}>{matches.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: cs2.textSecondary, letterSpacing: 2 }}>Total Players</Typography>
                <Typography variant="h3" sx={{ color: cs2.accent, fontWeight: 800 }}>{players.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: cs2.textSecondary, letterSpacing: 2 }}>Total Months</Typography>
                <Typography variant="h3" sx={{ color: cs2.accent, fontWeight: 800 }}>{months.length - 1}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Match Table Header */}
        <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600, mb: 2, display: 'block' }}>
          MATCH HISTORY
        </Typography>

        <TableContainer component={Paper} sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: cs2.bgDark }}>
                <TableCell sx={{ color: cs2.textSecondary }}>Date</TableCell>
                <TableCell sx={{ color: cs2.textSecondary }}>Teams</TableCell>
                <TableCell sx={{ color: cs2.textSecondary }}>Map</TableCell>
                <TableCell sx={{ color: cs2.textSecondary }}>Favorite</TableCell>
                <TableCell sx={{ color: cs2.textSecondary }}>Demo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => {
                const mapImg = getMapImage(match.map);
                const matchId = String(match.matchid);
                const hasLiked = likedMatches.includes(matchId);
                const likes = likeCounts[matchId] || { count: 0, users: [] };
                return (
                <TableRow
                  key={match.matchid}
                  onClick={() => handleRowClick(match)}
                  sx={{ 
                    cursor: 'pointer', 
                    position: 'relative',
                    height: 80,
                    backgroundImage: mapImg 
                      ? `linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.85) 40%, rgba(26,26,26,0.6) 100%), url(${mapImg})` 
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    '&:hover': { 
                      backgroundImage: mapImg 
                        ? `linear-gradient(to right, rgba(37,37,37,0.9) 0%, rgba(37,37,37,0.7) 40%, rgba(37,37,37,0.4) 100%), url(${mapImg})` 
                        : 'none',
                      bgcolor: mapImg ? 'transparent' : cs2.bgHover,
                      transform: 'scale(1.01)',
                    },
                    transition: 'all 0.3s ease',
                    borderBottom: `1px solid ${cs2.border}`,
                  }}
                >
                  <TableCell sx={{ color: cs2.textPrimary }}>{match.date}</TableCell>
                  <TableCell sx={{ color: cs2.textPrimary, fontWeight: 600 }}>{extractTeams(match.url)}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: cs2.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {match.map?.replace('de_', '').replace('cs_', '')}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={user ? (hasLiked ? 'Remove from favorites' : 'Add to favorites') : 'Login to save favorites'}>
                        <span>
                          <IconButton
                            onClick={(e) => handleLikeClick(e, matchId)}
                            disabled={!user}
                            size="small"
                            sx={{ 
                              color: hasLiked ? '#ef4444' : cs2.textSecondary,
                              bgcolor: hasLiked ? 'rgba(239,68,68,0.15)' : 'transparent',
                              '&:hover': { 
                                color: '#ef4444',
                                bgcolor: 'rgba(239,68,68,0.2)',
                              },
                            }}
                          >
                            {hasLiked ? <HeartIcon /> : <HeartOutlineIcon />}
                          </IconButton>
                        </span>
                      </Tooltip>
                      {likes.count > 0 && (
                        <Tooltip 
                          title={likes.users.map(u => u.name || u.username).join(', ')}
                          arrow
                        >
                          <Chip
                            size="small"
                            label={likes.count}
                            sx={{ 
                              bgcolor: hasLiked ? 'rgba(239,68,68,0.2)' : `${cs2.accent}20`, 
                              color: hasLiked ? '#ef4444' : cs2.accent,
                              fontWeight: 600,
                              cursor: 'pointer',
                              minWidth: 28,
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      href={match.demo_url}
                      download
                      onClick={handleDownloadClick}
                      sx={{ bgcolor: cs2.accent, '&:hover': { bgcolor: '#ff7c3c' } }}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }
          }}
        >
          <DialogTitle sx={{ color: cs2.accent, textTransform: 'uppercase', letterSpacing: 2 }}>Match Details</DialogTitle>
          <DialogContent>
            {selectedMatch ? (
              <MatchStats matchId={selectedMatch.matchid} url={selectedMatch.url} />
            ) : (
              <Typography variant="body1" sx={{ color: cs2.textSecondary }}>Loading match details...</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: `1px solid ${cs2.border}` }}>
            <Button onClick={handleCloseDialog} sx={{ color: cs2.accent }}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
