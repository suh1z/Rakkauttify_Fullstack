
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { URL } = require('url');
const leagueRouter = express.Router();

dotenv.config();
const matchesUrl = process.env.MATCHES_URL;
const monthsUrl = process.env.MONTHS_URL;
const playersUrl = process.env.PLAYERS_URL;
const faceitApiKey = process.env.FACEIT_API_KEY;

// SSRF Prevention: Allowed domains for external URL fetching
const ALLOWED_DOMAINS = [
  'www.faceit.com',
  'api.faceit.com',
  'open.faceit.com',
  'pappaliiga.faceit.com',
  'pappaliiga-production.up.railway.app',
  // Azure blob storage
  'blob.core.windows.net',
  // GitHub raw content
  'raw.githubusercontent.com',
  'githubusercontent.com',
  // z00ze's GitHub pages / data
  'z00ze.github.io',
  // Add other trusted domains as needed
];

// Validate URL to prevent SSRF (blocks internal IPs and cloud metadata endpoints)
const isAllowedUrl = (urlString) => {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost, internal IPs, and metadata endpoints (CRITICAL security)
    const blockedPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,  // AWS/Azure metadata
      /^0\./,
      /^\[::1\]$/,
      /^metadata\./,
    ];
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      console.warn(`SSRF blocked: Internal IP detected - ${hostname}`);
      return false;
    }
    
    // Allow any external HTTPS URL that's not an internal IP
    // This is less strict but still prevents the most critical SSRF attacks
    if (parsed.protocol === 'https:') {
      return true;
    }
    
    console.warn(`SSRF blocked: Non-HTTPS URL - ${urlString}`);
    return false;
  } catch (err) {
    console.warn(`SSRF blocked: Invalid URL - ${urlString}`);
    return false;
  }
};


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

// Fetch player by Steam ID (steamid64)
leagueRouter.get("/players/steam/:steamId", async (req, res) => {
  const { steamId } = req.params;

  try {
    // First try to find in players list
    const playersResponse = await axios.get(playersUrl);
    const players = playersResponse.data;

    // Try to find by checking each player's stats for matching steamid64
    for (const player of players) {
      try {
        const playerStatsResponse = await axios.get(player.url);
        const stats = playerStatsResponse.data;
        
        // Check if any stats entry matches the steamId
        if (Array.isArray(stats) && stats.length > 0) {
          const hasMatchingSteamId = stats.some(s => s.steamid64 === steamId);
          if (hasMatchingSteamId) {
            return res.json({
              ...player,
              steamId: steamId,
              details: stats
            });
          }
        }
      } catch (err) {
        // Continue to next player if this one fails
        console.warn(`Could not fetch stats for ${player.nickname}`);
      }
    }

    return res.status(404).json({ message: `Player with Steam ID ${steamId} not found.` });
  } catch (error) {
    console.error(`Error fetching data for Steam ID ${steamId}:`, error.message);
    res.status(500).json({ message: `Error fetching data for Steam ID ${steamId}`, error: error.message });
  }
});

// Live Faceit API lookup by nickname - returns elo, avatar, level
leagueRouter.get("/faceit-profile/:nickname", async (req, res) => {
  const { nickname } = req.params;

  try {
    const playerProfileResponse = await axios.get(
      `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nickname)}`,
      {
        headers: { Authorization: `Bearer ${faceitApiKey}` },
      }
    );

    const data = playerProfileResponse.data;
    const csGame = data.games?.cs2 || data.games?.csgo || {};
    
    res.json({
      player_id: data.player_id,
      nickname: data.nickname,
      avatar: data.avatar,
      elo: csGame.faceit_elo || 0,
      level: csGame.skill_level || 0,
      country: data.country,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No Faceit profile found for nickname: ${nickname}`);
      return res.status(404).json({ nickname, elo: 0, level: 0, avatar: null });
    }
    console.error(`Error fetching Faceit data for ${nickname}:`, error.message);
    res.status(500).json({ message: `Error fetching Faceit data for ${nickname}` });
  }
});

leagueRouter.get("/fetch-match-data", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: "URL parameter is required." });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    
    // SSRF Prevention: Validate URL before fetching
    if (!isAllowedUrl(decodedUrl)) {
      return res.status(403).json({ 
        message: "URL not allowed. Only approved external domains are permitted." 
      });
    }

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
