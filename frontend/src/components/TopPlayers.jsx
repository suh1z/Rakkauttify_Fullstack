import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material';

const TopPlayers = ({ data, metric = 'matches_played' }) => {
  if (!data || data.length === 0) return null;

  const filteredPlayers = data.filter(player => player.matches_played >= 5);

  if (filteredPlayers.length === 0) return <Typography>No players meet the minimum match requirement.</Typography>;

  const topPlayers = [...filteredPlayers]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 3);

  return (
    <>
      <Typography variant="h6">Top R*ratings of the Month</Typography>
      <Grid container spacing={2}>
        {topPlayers.map((player) => (
          <Grid item xs={12} sm={4} key={player.nickname}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar>
                      {player.nickname[0].toUpperCase()}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">{player.nickname}</Typography>
                    <Typography variant="body2">
                      {`${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${player[metric].toFixed(2)}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

TopPlayers.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    matches_played: PropTypes.number.isRequired,
    kills: PropTypes.number,
  })).isRequired,
  metric: PropTypes.string,
};

export default TopPlayers;