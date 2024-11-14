const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const leagueRouter = express.Router();

const matchesUrl = process.env.MATCHES_URL;
const monthsUrl = process.env.MONTHS_URL;
const playersUrl = process.env.PLAYERS_URL;

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
    const response = await axios.get(decodeURIComponent(url));
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching dynamic data:', error.message);
    res.status(500).json({ message: 'Error fetching dynamic data', error: error.message });
  }
});

module.exports = leagueRouter;
