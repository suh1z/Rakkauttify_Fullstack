/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializePlayers } from '../reducers/statsReducer';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const PlayerSelector = ({ players, onPlayerSelect }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializePlayers());
  }, [dispatch]);

  const sortedPlayers = [...players].sort((a, b) => a.nickname.localeCompare(b.nickname));

  const defaultValue = sortedPlayers.length > 0 ? sortedPlayers[0].nickname : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <FormControl>
          <InputLabel>Player</InputLabel>
          <Select
            onChange={(e) => onPlayerSelect(e.target.value)}
            defaultValue={defaultValue}
            label="Player"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 'auto',
                },
              },
            }}
          >
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
