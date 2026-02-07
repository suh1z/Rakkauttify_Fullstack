import axios from 'axios';

const baseUrl = '/api';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const FACEIT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for Faceit data (changes less often)

const getCached = (key, ttl = CACHE_TTL) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    // Return a deep copy to prevent mutation issues
    return JSON.parse(JSON.stringify(cached.data));
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const getStats = async () => {
  const cacheKey = 'stats';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/months/months`); 
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats from the backend:', error);
    throw error;
  }
};

const getMatches = async () => {
  const cacheKey = 'matches';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/matches/matches`); 
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches from the backend:', error);
    throw error;
  }
};

const fetchMatchData = async (url) => {
  const cacheKey = `match-${url}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/fetch-match-data/fetch-match-data?url=${encodeURIComponent(url)}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching match data from URL:', error);
    throw error;
  }
};

const fetchPlayerData = async (nickname) => {
  const cacheKey = `playerdata-${nickname}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/players/players/${nickname}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching player data from the backend:', error);
    throw error;
  }
};

const fetchAllPlayers = async () => {
  const cacheKey = 'allplayers';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/players/players`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all players from the backend:', error);
    throw error;
  }
};

// Fetch live Faceit profile (elo, avatar, level) by nickname
const fetchFaceitProfile = async (nickname) => {
  const cacheKey = `faceit-${nickname}`;
  const cached = getCached(cacheKey, FACEIT_CACHE_TTL);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/faceit-profile/faceit-profile/${nickname}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Return null for 404s (player not found on Faceit)
    if (error.response && error.response.status === 404) {
      // Cache the null result to avoid repeated 404 requests
      setCache(cacheKey, null);
      return null;
    }
    console.error('Error fetching Faceit profile:', error);
    throw error;
  }
};

// Clear cache (useful for forced refresh)
const clearCache = () => cache.clear();

export default { getStats, getMatches, fetchMatchData, fetchPlayerData, fetchAllPlayers, fetchFaceitProfile, clearCache };
