import { createSlice } from '@reduxjs/toolkit';
import statsService from '../services/statsService';

const excludedKeys = ['steamid64', 'name', 'team', 'matchid', 'mapnumber'];
const summedKey = ['played'];

const cardSlice = createSlice({
  name: 'stats',
  initialState: {
    stats: [],
    statistics: {},
    playerStats: [],
    matches: [],
    match: [],
  },
  reducers: {
    setStats(state, action) {
      state.stats = action.payload;
    },
    setMatches(state, action) {
      const sortThis = action.payload;
      const sortedByDate = sortThis.sort(function (a, b) {
        return b.matchid - a.matchid;
      });
      state.matches = sortedByDate;

      state.matches.forEach(match => {
        if (!match.url) {
          console.error(`Match with ID ${match.matchid} has no URL.`);
        }
      });
    },
    setMatch(state, action) {
      const { matchId, matchData } = action.payload;
      const match = state.matches.find((item) => item.matchid === matchId);

      if (match) {
        state.match = { ...match, matchData };
      } else {
        state.match = null;
      }
    },
    setStatistics(state, action) {
      const { recentGamesCount } = action.payload;
      const totalGames = state.stats.length;
      const start = Math.max(0, totalGames - recentGamesCount * 10);
      const recentStats = state.stats.slice(start);
      const result = recentStats.reduce((acc, stat) => {
        const key = stat.steamid64;

        if (!acc[key]) {
          acc[key] = {
            name: stat.name,
          };
        }

        Object.entries(stat).forEach(([statKey, value]) => {
          if (!excludedKeys.includes(statKey)) {
            if (!acc[key][statKey]) {
              acc[key][statKey] = 0;
            }
            if (summedKey.includes(statKey)) {
              const maxValue = acc[key][statKey];
              if (value > maxValue) {
                acc[key][statKey] = value;
              }
            } else {
              acc[key][statKey] += parseInt(value, 10);
            }
          }
        });

        return acc;
      }, {});

      state.statistics = result;
    },
    setPlayerStats(state, action) {
      const { playerName } = action.payload;
      const normalizedPlayerName =
        typeof playerName === 'string' ? playerName.trim().toLowerCase() : '';
      const filteredStats = state.stats.filter((item) => {
        const nameInItem =
          typeof item.name === 'string' ? item.name.trim().toLowerCase() : '';
        return nameInItem === normalizedPlayerName;
      });
      filteredStats.sort((a1, a2) => a1.matchid - a2.matchid);
      state.playerStats = filteredStats.slice(-10);
    },
  },
});

export const { setStats, setStatistics, setPlayerStats, setMatches, setMatch } = cardSlice.actions;

export const initializeStats = () => async (dispatch) => {
  try {
    const stats = await statsService.getStats();
    dispatch(setStats(stats));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const initializeMatches = () => async (dispatch) => {
  try {
    const matches = await statsService.getMatches();
    dispatch(setMatches(matches));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const initializeMatch = (matchId, url) => async (dispatch) => {
  if (!url) {
    console.error('URL is required to fetch match data!');
    return;
  }
  try {
    const matchData = await statsService.fetchMatchData(url);
    dispatch(setMatch({ matchId, matchData }));
  } catch (error) {
    console.error('Error fetching match data:', error);
  }
};

export const initializeStatistics = (recentGamesCount) => (dispatch) => {
  try {
    dispatch(setStatistics({ recentGamesCount }));
  } catch (error) {
    console.error('Error computing statistics:', error);
  }
};

export const playerSetStats = (playerName) => (dispatch) => {
  try {
    dispatch(setPlayerStats({ playerName }));
  } catch (error) {
    console.error('Error filtering player stats:', error);
  }
};

export default cardSlice.reducer;
