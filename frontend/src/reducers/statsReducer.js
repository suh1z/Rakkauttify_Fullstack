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
    players: [],
    months: []
  },
  reducers: {
    setStats(state, action) {
      state.stats = action.payload;
    },
    setMatches(state, action) {
      const sortedByDate = action.payload.sort((a, b) => b.matchid - a.matchid);
      state.matches = sortedByDate;

      state.matches.forEach((match) => {
        if (!match.url) {
          console.error(`Match with ID ${match.matchid} has no URL.`);
        }
      });
    },
    setMatch(state, action) {
      const { matchId, matchData } = action.payload;
      const match = state.matches.find((item) => item.matchid === matchId);

      state.match = match ? { ...match, matchData } : null;
    },
    setStatistics(state, action) {
      const { recentGamesCount } = action.payload;
      const totalGames = state.stats.length;
      const start = Math.max(0, totalGames - recentGamesCount * 10);
      const recentStats = state.stats.slice(start);
      const result = recentStats.reduce((acc, stat) => {
        const key = stat.steamid64;

        if (!acc[key]) {
          acc[key] = { name: stat.name };
        }

        Object.entries(stat).forEach(([statKey, value]) => {
          if (!excludedKeys.includes(statKey)) {
            if (!acc[key][statKey]) {
              acc[key][statKey] = 0;
            }
            if (summedKey.includes(statKey)) {
              acc[key][statKey] = Math.max(acc[key][statKey], value);
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
      const { playerName, playerData } = action.payload;
      if (playerData) {
        state.playerStats = playerData;
      } else {
        const normalizedPlayerName = typeof playerName === 'string' ? playerName.trim().toLowerCase() : '';
        const filteredStats = state.stats.filter((item) => {
          const nameInItem = typeof item.name === 'string' ? item.name.trim().toLowerCase() : '';
          return nameInItem === normalizedPlayerName;
        });
        filteredStats.sort((a1, a2) => a1.matchid - a2.matchid);
        state.playerStats = filteredStats.slice(-10);
      }
    },
    setPlayers(state, action) {
      state.players = action.payload.sort((a, b) => a.nickname.localeCompare(b.nickname));
    },
    setMonths(state, action) {
      state.months = action.payload
    },
  },
});

export const { setStats, setStatistics, setPlayerStats, setMatches, setMatch, setPlayers, setMonths } = cardSlice.actions;

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

export const initializePlayerStats = (nickname) => async (dispatch) => {
  try {
    const playerData = await statsService.fetchPlayerData(nickname);
    dispatch(setPlayerStats({ playerName: nickname, playerData }));
  } catch (error) {
    console.error('Error fetching player stats:', error);
  }
};

export const initializePlayers = () => async (dispatch) => {
  try {
    const players = await statsService.fetchAllPlayers();
    dispatch(setPlayers(players));
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

export const initializeMonths = () => async (dispatch) => {
  try {
    const months = await statsService.getStats();
    dispatch(setMonths(months));
  } catch (error) {
    console.error('Error fetching months:', error);
  }
};
export default cardSlice.reducer;
