import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Container } from '@mui/material';
import { initializeMatches, initializePlayers, initializeMonths, initializeMatch } from '../reducers/statsReducer';
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const matches = useSelector((state) => state.stats.matches);
  const players = useSelector((state) => state.stats.players);
  const months = useSelector((state) => state.stats.months);

  useEffect(() => {
    dispatch(initializeMatches());
    dispatch(initializePlayers());
    dispatch(initializeMonths());
  }, [dispatch]);

  const handleRowClick = (match) => {
    setSelectedMatch(match);
    dispatch(initializeMatch(match.matchId, match.url));
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
                <TableCell sx={{ color: cs2.textSecondary }}>Demo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow
                  key={match.matchId}
                  onClick={() => handleRowClick(match)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: cs2.bgHover } }}
                >
                  <TableCell sx={{ color: cs2.textPrimary }}>{match.date}</TableCell>
                  <TableCell sx={{ color: cs2.textPrimary, fontWeight: 600 }}>{extractTeams(match.url)}</TableCell>
                  <TableCell sx={{ color: cs2.textSecondary }}>{match.map}</TableCell>
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
              ))}
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
              <MatchStats matchId={selectedMatch.matchId} url={selectedMatch.url} />
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
