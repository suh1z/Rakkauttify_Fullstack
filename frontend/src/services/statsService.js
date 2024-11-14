import axios from 'axios';

const baseUrl = '/api';

const getStats = async () => {
  try {
    const response = await axios.get(`${baseUrl}/months/months`); 
    return response.data;
  } catch (error) {
    console.error('Error fetching stats from the backend:', error);
    throw error;
  }
};

const getMatches = async () => {
  try {
    const response = await axios.get(`${baseUrl}/matches/matches`); 
    return response.data;
  } catch (error) {
    console.error('Error fetching matches from the backend:', error);
    throw error;
  }
};

const fetchMatchData = async (url) => {
  try {
    const response = await axios.get(`${baseUrl}/fetch-match-data/fetch-match-data?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match data from URL:', error);
    throw error;
  }
};

const fetchPlayerData = async (nickname) => {
  try {
    const response = await axios.get(`${baseUrl}/players/players/${nickname}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player data from the backend:', error);
    throw error;
  }
};

const fetchAllPlayers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/players/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all players from the backend:', error);
    throw error;
  }
};

export default { getStats, getMatches, fetchMatchData, fetchPlayerData, fetchAllPlayers };
