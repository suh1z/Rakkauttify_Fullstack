/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializePlayers } from '../reducers/statsReducer';
import { MenuItem, Select, FormControl, Typography } from '@mui/material';

const PlayerSelector = ({ players, onPlayerSelect }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializePlayers());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h6" style={{ marginRight: '10px' }}>
        Select Player
      </Typography>
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <FormControl>
          <Select
            onChange={(e) => onPlayerSelect(e.target.value)}
            defaultValue=""
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 'auto',
                },
              },
            }}
          >
            <MenuItem value="" disabled style={{ color: '#999' }}>
              Select a player
            </MenuItem>
            {players.map((player) => (
              <MenuItem key={player.nickname} value={player.nickname}>
                {player.nickname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PlayerSelector;
