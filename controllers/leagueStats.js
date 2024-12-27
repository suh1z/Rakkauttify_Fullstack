const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const leagueRouter = express.Router();

const matchesUrl = process.env.MATCHES_URL;
const monthsUrl = process.env.MONTHS_URL;
const playersUrl = process.env.PLAYERS_URL;
const faceitApiKey = process.env.FACEIT_API_KEY;

if (!matchesUrl || !monthsUrl || !playersUrl) {
  console.error('Error: Environment variables for URLs are not set.');
}

async function fetchDataFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error(`Error fetching data from ${url}`);
  }
}

leagueRouter.get("/matches", async (req, res) => {
  try {
    const response = await axios.get(matchesUrl);
    const matchesWithId = response.data.map((match, index) => ({
      ...match,
      matchid: index + 1
    }));
    res.json(matchesWithId);
  } catch (error) {
    console.error('Error fetching matches data:', error.message);
    res.status(500).json({ message: 'Error fetching matches data', error: error.message });
  }
});

leagueRouter.get("/months", async (req, res) => {
  try {
    const response = await axios.get(monthsUrl);
    const monthsData = response.data;

    const dataWithMonths = await Promise.all(monthsData.map(async (item) => {
      const data = await fetchDataFromUrl(item.url);
      return { month: item.month, data };
    }));

    res.json(dataWithMonths);
  } catch (error) {
    console.error('Error fetching months data:', error.message);
    res.status(500).json({ message: 'Error fetching months data', error: error.message });
  }
});


leagueRouter.get("/players", async (req, res) => {
  try {
    const response = await axios.get(playersUrl);
    res.json(response.data); 
  } catch (error) {
    console.error('Error fetching players data:', error.message);
    res.status(500).json({ message: 'Error fetching players data', error: error.message });
  }
});

leagueRouter.get("/players/:nickname", async (req, res) => {
  const { nickname } = req.params;

  try {
    const response = await axios.get(playersUrl);
    const players = response.data;

    const player = players.find(p => p.nickname === nickname);

    if (!player) {
      return res.status(404).json({ message: `Player with nickname ${nickname} not found.` });
    }

    const playerDetailsResponse = await axios.get(player.url);
    res.json({
      ...player,
      details: playerDetailsResponse.data
    });
  } catch (error) {
    console.error(`Error fetching data for player ${nickname}:`, error.message);
    res.status(500).json({ message: `Error fetching data for player ${nickname}`, error: error.message });
  }
});

leagueRouter.get("/fetch-match-data", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: "URL parameter is required." });
  }

  try {
    const decodedUrl = decodeURIComponent(url);

    const matchDataResponse = await axios.get(decodedUrl);
    const matchData = matchDataResponse.data;

    if (!Array.isArray(matchData.player_scores) || matchData.player_scores.length === 0) {
      return res.status(400).json({ message: "No player data found in match data." });
    }

    const steamIds = matchData.player_scores.map(player => player.steam_id);
    
    if (steamIds.length === 0) {
      return res.status(400).json({ message: "No Steam IDs found in match data." });
    }

    const faceitProfiles = await Promise.all(
      steamIds.map(async (steamId) => {
        try {
          const playerProfileResponse = await axios.get(
            `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${steamId}`,
            {
              headers: { Authorization: `Bearer ${faceitApiKey}` },
            }
          );
    
          return {
            steam_id: steamId,
            nickname: playerProfileResponse.data.nickname,
            elo: playerProfileResponse.data.games.cs2.faceit_elo,
            avatar: playerProfileResponse.data.avatar,
          };
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn(`No Faceit profile found for Steam ID: ${steamId}`);
            return { steam_id: steamId, nickname: 'Unknown', elo: 0, avatar: null };
          } else {
            console.error(`Error fetching Faceit data for ${steamId}:`, error.message);
            return { steam_id: steamId, nickname: 'Unknown', elo: 0, avatar: null };
          }
        }
      })
    );


    const combinedMatchData = {
      ...matchData,
      player_scores: matchData.player_scores.map(player => {
        
        const faceitProfile = faceitProfiles.find(
          profile => profile && profile.steam_id === player.steam_id
        );

        console.log("Found Faceit profile:", faceitProfile);

        return {
          ...player,
          faceit: faceitProfile || { steam_id: player.steam_id, nickname: 'Unknown', elo: 0, avatar: null }
        };
      }),
    };

    console.log("Combined match data:", combinedMatchData);
    res.json(combinedMatchData);
  } catch (error) {
    console.error("Error fetching match data:", error);
    res.status(500).json({ message: "Error fetching match data" });
  }
});

module.exports = leagueRouter;
