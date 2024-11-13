const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const leagueRouter = express.Router();

const matchesUrl = process.env.MATCHES_URL;
const monthsUrl = process.env.MONTHS_URL;

if (!matchesUrl || !monthsUrl) {
  console.error('Error: Environment variables for URLs are not set.');
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
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching months data:', error.message);
    res.status(500).json({ message: 'Error fetching months data', error: error.message });
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
