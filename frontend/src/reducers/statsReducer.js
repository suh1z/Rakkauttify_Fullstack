/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import statsService from '../services/statsService';
import { mapPlayerData, formattedMonths, formatPlayerData} from '../utils/scoreUtils';

const cardSlice = createSlice({
  name: 'stats',
  initialState: {
    stats: [],
    playerStats: [],
    matches: [],
    match: [],
    players: [],
    months: [],
  },
  reducers: {
    setStats(state, action) {
      state.stats = action.payload;
    },
    fetchMatches(state, action) {
      state.matches = action.payload;
    },
    setMatch(state, action) {
      const { matchId, matchData } = action.payload;
      state.match = { matchId, ...matchData };
    },    
    setStatistics(state, action) {
      state.statistics = action.payload;
    },
    setPlayerStats(state, action) {
      state.playerStats = action.payload;
    },
    setPlayers(state, action) {
      state.players = action.payload;
    },
    setMonths(state, action) {
      state.months = action.payload;
    },
  },
});

export const { setStats, setPlayerStats, fetchMatches, setMatch, setPlayers, setMonths } = cardSlice.actions;

export const initializeStats = () => async (dispatch) => {
  try {
    const stats = await statsService.getStats();
    dispatch(setStats(stats));
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

export const initializeMatches = () => async (dispatch) => {
  try {
    const matches = await statsService.getMatches();
    dispatch(fetchMatches(matches));
  } catch (error) {
    console.error('Error fetching matches:', error);
  }
};

export const initializeMatch = (matchId, url) => async (dispatch) => {
  if (!url) {
    console.error('URL is required to fetch match data!');
    return;
  }
  try {
    const matchData = await statsService.fetchMatchData(url);
    const extendedPlayerScores = matchData.player_scores.map(mapPlayerData);
    const extendedMatchData = {
      player_scores: extendedPlayerScores,
    };

    dispatch(setMatch({ matchId, matchData: extendedMatchData }));
  } catch (error) {
    console.error('Error fetching match data:', error);
  }
};

export const initializePlayerStats = (nickname) => async (dispatch) => {
  try {
    const formattedPlayerData = await statsService.fetchPlayerData(nickname, statsService);
    dispatch(setPlayerStats(formatPlayerData(formattedPlayerData)));
  } catch (error) {
    console.error('Error initializing player stats:', error);
  }
};


export const initializePlayers = () => async (dispatch) => {
  try {
    const players = await statsService.fetchAllPlayers();
    const sortedPlayers = players.sort((a, b) => (a.nickname > b.nickname ? 1 : -1));
    dispatch(setPlayers(sortedPlayers));
  } catch (error) {
    console.error('Error fetching players:', error);
  }
};

export const initializeMonths = () => async (dispatch) => {
  try {
    const months = await statsService.getStats();
    const sortedMonths = months.sort((a, b) => (a.month < b.month ? 1 : -1));
    const formattedMonthsData = sortedMonths.map((month) => {
      if (Array.isArray(month.data)) {
        return formattedMonths(month);
      }
      return month;
    });
    dispatch(setMonths(formattedMonthsData));

  } catch (error) {
    console.error('Error fetching months:', error);
  }
};


export default cardSlice.reducer;
