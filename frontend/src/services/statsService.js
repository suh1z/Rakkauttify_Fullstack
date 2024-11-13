import axios from 'axios';

const baseUrl = '/api/matches/matches';
const baseUrlstats = '/api/months/months';
const baseUrlFetch = '/api/fetch-match-data/fetch-match-data';  

const getStats = async () => {
  try {
    const response = await axios.get(baseUrlstats); 
    return response.data;
  } catch (error) {
    console.error('Error fetching matches from the backend:', error);
    throw error;
  }
};

const getMatches = async () => {
  try {
    const response = await axios.get(baseUrl); 
    return response.data;
  } catch (error) {
    console.error('Error fetching matches from the backend:', error);
    throw error;
  }
};
const fetchMatchData = async (url) => {
  try {
    const response = await axios.get(`${baseUrlFetch}?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match data from URL:', error);
    throw error;
  }
};

export default { getStats, getMatches, fetchMatchData };
