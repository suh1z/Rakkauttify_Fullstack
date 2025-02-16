import { createSlice } from "@reduxjs/toolkit";
import pappaService from "../services/pappaService";

const pappaSlice = createSlice({
  name: "pappa",
  initialState: {
    teams: [],
    player: null,
    matches: [],
    pickBans: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTeamsSuccess(state, action) {
      state.teams = action.payload;
      state.loading = false;
    },
    fetchPlayerSuccess(state, action) {
      state.player = action.payload;
      state.loading = false;
    },
    fetchMatchesSuccess(state, action) {
      state.matches = action.payload;
      state.loading = false;
    },
    fetchPickBansSuccess(state, action) {
      state.pickBans = action.payload;
      state.loading = false;
    },
    fetchFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchStart,
  fetchTeamsSuccess,
  fetchPlayerSuccess,
  fetchMatchesSuccess,
  fetchPickBansSuccess,
  fetchFailure,
} = pappaSlice.actions;

export const fetchTeams = (division, season) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const teams = await pappaService.fetchTeams(division, season);
    dispatch(fetchTeamsSuccess(teams));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export const fetchPlayer = (playerId) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const player = await pappaService.fetchPlayer(playerId);
    dispatch(fetchPlayerSuccess(player));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export const fetchMatches = (division, season) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const matches = await pappaService.fetchMatches(division, season);
    dispatch(fetchMatchesSuccess(matches));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export const fetchPickBans = (matchId) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const pickBans = await pappaService.fetchPickBans( matchId);
    dispatch(fetchPickBansSuccess(pickBans));
  } catch (error) {
    dispatch(fetchFailure(error.message));
  }
};

export default pappaSlice.reducer;
