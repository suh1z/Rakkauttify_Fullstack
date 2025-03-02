import { createSlice } from "@reduxjs/toolkit";
import pappaService from "../services/pappaService";



const pappaSlice = createSlice({
  name: "pappa",
  initialState: {
    teams: [],
    player: null,
    matches: [],
    pickBans: {},
    error: null,
  },
  reducers: {
    fetchTeamsSuccess(state, action) {
      state.teams = action.payload;
      state.error = null; 
    },
    fetchPlayerSuccess(state, action) {
      state.player = action.payload;
      state.error = null; 
    },
    fetchMatchesSuccess(state, action) {
      state.matches = action.payload;
      state.error = null; 
    },
    fetchPickBansSuccess(state, action) {
      state.pickBans = action.payload;
      state.error = null;
    },
    fetchFailure(state, action) {
      state.error = action.payload; 
    },
  },
});

export const {
  fetchTeamsSuccess,
  fetchPlayerSuccess,
  fetchMatchesSuccess,
  fetchPickBansSuccess,
  fetchFailure,
} = pappaSlice.actions;

export const fetchTeams = (division, season) => async (dispatch) => {
  try {
    const teams = await pappaService.fetchTeams(division, season);
    dispatch(fetchTeamsSuccess(teams));
  } catch (error) {
    dispatch(fetchFailure("Error fetching teams: " + error.message));
  }
};

export const fetchPlayer = (playerId) => async (dispatch) => {
  try {
    const player = await pappaService.fetchPlayer(playerId);
    dispatch(fetchPlayerSuccess(player));
  } catch (error) {
    dispatch(fetchFailure("Error fetching player: " + error.message));
  }
};

export const fetchMatches = (division, season) => async (dispatch) => {
  try {
    const matches = await pappaService.fetchMatches(division, season);
    dispatch(fetchMatchesSuccess(matches));
  } catch (error) {
    dispatch(fetchFailure("Error fetching matches: " + error.message));
  }
};

export const fetchPickBans = (round, matchId) => async (dispatch) => {
  try {
    const response = await pappaService.fetchPickBans(matchId, round);  
    dispatch(fetchPickBansSuccess(response));
  } catch (error) {
    dispatch(fetchFailure("Error fetching pick & bans: " + error.message));
  }
};


export default pappaSlice.reducer;
