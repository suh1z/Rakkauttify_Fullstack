import axios from "axios";

const baseUrl = "/api/data";

const fetchTeams = async (division, season) => {
  try {
    const response = await axios.get(`${baseUrl}/data?division=${division}&season=${season}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
};

const fetchPlayer = async (playerId) => {
  try {
    const response = await axios.get(`${baseUrl}/player/${playerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw new Error("Failed to fetch player data");
  }
};

const fetchMatches = async (division, season) => {
  try {
    const response = await axios.get(`${baseUrl}/matches?division=${division}&season=${season}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches");
  }
};

const fetchPickBans = async (round, matchId) => {
  try {
    const url = `${String(baseUrl)}/pickbans/${String(round)}/${String(matchId)}`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pick & ban data:", error);
    throw new Error("Failed to fetch pick & ban data");
  }
};

export default { fetchTeams, fetchPlayer, fetchMatches, fetchPickBans };
