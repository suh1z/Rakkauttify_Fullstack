const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const azureRouter = express.Router();
const qs = require('qs');

dotenv.config();

const azureTenantId = process.env.AZURE_TENANT_ID;
const azureClientId = process.env.AZURE_CLIENT_ID;
const azureClientSecret = process.env.AZURE_CLIENT_SECRET;
const azureScope = process.env.AZURE_SCOPE;
const azureAuthUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`;
const baseUrl = process.env.DIVISION_URL;

let lastDivision = null;
let lastSeason = null;

async function getAzureAccessToken() {
  try {
    const requestBody = qs.stringify({
      client_id: azureClientId,
      client_secret: azureClientSecret,
      scope: azureScope,
      grant_type: "client_credentials",
    });

    const response = await axios.post(azureAuthUrl, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error("Authentication with Azure failed");
  }
}

async function fetchDataFromAzure(division, season, endpoint) {
  try {
    const token = await getAzureAccessToken();
    const dynamicUrl = `${baseUrl}/${division}%20Divisioona%20S${season}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "x-ms-version": "2021-08-06",
    };

    const response = await axios.get(dynamicUrl, { headers });

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching ${endpoint} from Azure`);
  }
}

azureRouter.get('/data', async (req, res) => {
  try {
    const { division, season } = req.query;
    if (!division || !season) {
      return res.status(400).json({ error: "Missing division or season parameters" });
    }
    const data = await fetchDataFromAzure(division, season, "teams.json");

    lastDivision = division;
    lastSeason = season;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

azureRouter.get('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    if (!lastDivision || !lastSeason) {
      return res.status(400).json({ error: "Division and season not set. Call /data first." });
    }

    const playerData = await fetchDataFromAzure(
      lastDivision,
      lastSeason,
      `players/${playerId}/summary.json`
    );

    res.json(playerData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching player data from Azure" });
  }
});

azureRouter.get('/matches', async (req, res) => {
  try {
    const { division, season } = req.query;
    if (!division || !season) {
      return res.status(400).json({ error: "Missing division or season parameters" });
    }
    const matches = await fetchDataFromAzure(division, season, "matches.json");
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Error fetching match data from Azure" });
  }
});


azureRouter.get('/pickbans/:round/:matchId', async (req, res) => {
  try {
    const { round, matchId } = req.params;
    
    if (!lastDivision || !lastSeason) {
      return res.status(400).json({ error: "Division and season not set. Call /data first." });
    }
    const filePath = `${round}/pickbans_${matchId}.json`;
    const pickBansData = await fetchDataFromAzure(lastDivision, lastSeason, filePath);
    res.json(pickBansData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pick & bans data from Azure" });
  }
});

module.exports = azureRouter;
