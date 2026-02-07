import axios from "axios";

const baseUrl = "/api/data";

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    // Return a deep copy to prevent mutation issues
    return JSON.parse(JSON.stringify(cached.data));
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const fetchTeams = async (division, season) => {
  const cacheKey = `teams-${division}-${season}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/data?division=${division}&season=${season}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
};

const fetchPlayer = async (playerId) => {
  const cacheKey = `player-${playerId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/player/${playerId}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw new Error("Failed to fetch player data");
  }
};

const fetchMatches = async (division, season) => {
  const cacheKey = `matches-${division}-${season}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/matches?division=${division}&season=${season}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
};

const fetchAllMatches = async (division, season) => {
  const cacheKey = `allmatches-${division}-${season}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${baseUrl}/allmatches?division=${division}&season=${season}`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all matches");
  }
};


const fetchPickBans = async (round, matchId) => {
  const cacheKey = `pickbans-${round}-${matchId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `${String(baseUrl)}/pickbans/${String(round)}/${String(matchId)}`;
    const response = await axios.get(url);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pick & ban data:", error);
    throw new Error("Failed to fetch pick & ban data");
  }
};

// Clear cache (useful for forced refresh)
const clearCache = () => cache.clear();

export default { fetchTeams, fetchPlayer, fetchMatches, fetchAllMatches, fetchPickBans, clearCache };
