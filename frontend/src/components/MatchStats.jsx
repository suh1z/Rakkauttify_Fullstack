import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMatch } from '../reducers/statsReducer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// eslint-disable-next-line react/prop-types
const MatchStats = ({ matchId, url }) => {
    const dispatch = useDispatch();
    const matchData = useSelector((state) => state.stats.match);
    useEffect(() => {
      if (matchId && url) {
        dispatch(initializeMatch(matchId, url)); 
      }
    }, [dispatch, matchId, url]);
  
    if (!matchData || !matchData.player_scores) {
      return <div>Loading match stats...</div>;
    }

    const getRowColor = (teamId) => {
        switch (teamId) {
          case 2:
            return { backgroundColor: '#3c5485', color: 'white' }; 
          case 3:
            return { backgroundColor: '#8a7c54', color: 'white' };
          default:
            return { backgroundColor: 'transparent', color: 'inherit' };
        }
      };
  
    return (
      <div>
     <Typography>{matchData.player_scores[0].team}  VS {matchData.player_scores[9].team}</Typography>
     <Typography>Rounds {matchData.player_scores[0].team_rounds} / {matchData.player_scores[9].team_rounds}</Typography>
        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Nickname</TableCell>
                <TableCell>Kills</TableCell>
                <TableCell>Assists</TableCell>
                <TableCell>Deaths</TableCell>
                <TableCell>HS%</TableCell>
                <TableCell>KD</TableCell>
                <TableCell>UD</TableCell>
                <TableCell>ADR</TableCell>
                <TableCell>Faceit Elo</TableCell>
                <TableCell>Rrating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchData.player_scores.map((player, index) => {
                const rowStyle = getRowColor(player.team_id); 
                return (
                  <TableRow key={index} style={rowStyle}>
                    <TableCell>
                      {player.avatar ? (
                        <img src={player.avatar} alt={`${player.nickname} avatar`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'black' }} />
                      )}
                    </TableCell>
                    <TableCell>{player.nickname}</TableCell>
                    <TableCell>{player.kills}</TableCell>
                    <TableCell>{player.assists}</TableCell>
                    <TableCell>{player.deaths}</TableCell>
                    <TableCell>{player.hs_percent}</TableCell>
                    <TableCell>{player.kd}</TableCell>
                    <TableCell>{player.ud}</TableCell>
                    <TableCell>{player.adr}</TableCell>
                    <TableCell>{player.faceit_elo}</TableCell>
                    <TableCell>{player.rrating}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
};

export default MatchStats;
