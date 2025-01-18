import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { initializeMatches, initializePlayers, initializeMonths, initializeMatch } from '../reducers/statsReducer';
import MatchStats from './MatchStats';

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

    <div style={{ padding: '20px' }}>
    <Typography variant="h5" style={{ marginBottom: '20px' }}>Rakkauden Kanaali Inhouse Matches</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Matches</Typography>
              <Typography variant="h4">{matches.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Players</Typography>
              <Typography variant="h4">{players.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Months</Typography>
              <Typography variant="h4">{months.length-1}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Match Details</Typography>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Teams</TableCell>
              <TableCell>Map</TableCell>
              <TableCell>Demo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow
                key={match.matchId}
                onClick={() => handleRowClick(match)}
              >
                <TableCell>{match.date}</TableCell>
                <TableCell>{extractTeams(match.url)}</TableCell>
                <TableCell>{match.map}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    href={match.demo_url}
                    download
                    onClick={handleDownloadClick} 
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Match Details</DialogTitle>
        <DialogContent>
          {selectedMatch ? (
            <MatchStats match={selectedMatch} />
          ) : (
            <Typography variant="body1">Loading match details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
