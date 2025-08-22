/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TeamPlayersTable = ({
  teams,
  playerStatsById,
  handleTeamClick,
  expandedTeam,
}) => {
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleTeamSelect = (e) => {
    const teamName = e.target.value;
    setSelectedTeam(teamName);
    const team = teams.find((t) => t.name === teamName);
    if (team) handleTeamClick(team);
  };

  const calculateBasicStats = (stats) => {
    const kills = stats.Kills ?? 0;
    const deaths = stats.Deaths ?? 1; // avoid division by zero
    const headshots = stats.Headshots ?? 0;
    const rounds = stats.Rounds ?? 1;

    const kd = (kills / deaths).toFixed(2);
    const hsPercent = kills ? ((headshots / kills) * 100).toFixed(1) : "0";
    const kr = (kills / rounds).toFixed(2);

    return { kd, hsPercent, kr };
  };

/** 🔹 Aggregate map-level stats specifically from tournament data */
const calculateTournamentMapStats = (team) => {
  const mapTotals = {};

  team.roster.forEach((player) => {
    const tournamentMaps =
      playerStatsById[player.player_id]?.tournament_stats?.played_maps || {};

    Object.entries(tournamentMaps).forEach(([mapKey, value]) => {
      const isWin = mapKey.endsWith("_wins");
      const map = isWin ? mapKey.replace("_wins", "") : mapKey;

      if (!mapTotals[map]) mapTotals[map] = { played: 0, wins: 0 };

      // Instead of summing, take the maximum
      if (isWin) {
        mapTotals[map].wins = Math.max(mapTotals[map].wins, value);
      } else {
        mapTotals[map].played = Math.max(mapTotals[map].played, value);
      }
    });
  });

  return Object.entries(mapTotals).map(([map, { played, wins }]) => ({
    map,
    played,
    wins,
    losses: played - wins,
    winRate: played ? ((wins / played) * 100).toFixed(1) : 0,
  }));
};


  /** 🔹 Aggregate map-level stats for a team */
/** 🔹 Aggregate map-level stats for a team */
const calculateTeamMapStats = (team) => {
  const mapTotals = {};

  team.roster.forEach((player) => {
    const statsMaps =
      playerStatsById[player.player_id]?.stats?.played_maps || {};
    const tournamentMaps =
      playerStatsById[player.player_id]?.tournament_stats?.played_maps || {};

    // merge stats and tournament data
    const combinedMaps = { ...statsMaps, ...tournamentMaps };

    Object.entries(combinedMaps).forEach(([mapKey, value]) => {
      // normalize map name
      const isWin = mapKey.endsWith("_wins");
      const map = isWin ? mapKey.replace("_wins", "") : mapKey;

      if (!mapTotals[map]) mapTotals[map] = { played: 0, wins: 0 };

      if (isWin) {
        mapTotals[map].wins += value;
      } else {
        mapTotals[map].played += value;
      }
    });
  });

  return Object.entries(mapTotals).map(([map, { played, wins }]) => ({
    map,
    played,
    wins,
    losses: played - wins,        // 🔹 calculate losses per map
    winRate: played ? ((wins / played) * 100).toFixed(1) : 0,
  }));
};



  const renderMapChart = (team) => {
    const mapStats = calculateTeamMapStats(team);
    if (mapStats.length === 0) return null;
    mapStats.sort((a, b) => b.played - a.played);

    return (
      <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Overall Map Performance
      </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mapStats}>
            <XAxis
            dataKey="map"
            interval={0}              // 🔹 force show every tick
            angle={-30}               // 🔹 tilt labels if long
            textAnchor="end"          // 🔹 anchor properly
            height={80}               // 🔹 give space for rotated labels
            />            <YAxis />
            <Tooltip />
            <Bar dataKey="played" fill="#BDC3C7" name="Played" barSize={40} />
            <Bar dataKey="wins" fill="#27AE60" name="Wins" barSize={40} />
            <Bar dataKey="losses" fill="#E74C3C" name="Losses" barSize={40} />



          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  };
const renderTournamentMapChart = (team) => {
  const mapStats = calculateTournamentMapStats(team);
  if (mapStats.length === 0) return null;

  mapStats.sort((a, b) => b.played - a.played);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Tournament Map Performance
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mapStats}>
          <XAxis dataKey="map" interval={0} angle={-30} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="played" fill="#95A5A6" name="Played" barSize={40} />
          <Bar dataKey="wins" fill="#2ECC71" name="Wins" barSize={40} />
          <Bar dataKey="losses" fill="#E74C3C" name="Losses" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const renderTeamTable = (team) => {
  if (!team.roster || team.roster.length === 0)
    return <Typography>No players found.</Typography>;

  // Sort roster by game skill level or Faceit level in descending order
  const sortedRoster = [...team.roster].sort((a, b) => {
    const levelA = Number(a.game_skill_level ?? a.faceit_lvl ?? 0);
    const levelB = Number(b.game_skill_level ?? b.faceit_lvl ?? 0);
    return levelB - levelA; // highest level first
  });

  const firstPlayerStats =
    playerStatsById[team.roster[0].player_id]?.stats || {};
  const firstPlayerTournamentStats =
    playerStatsById[team.roster[0].player_id]?.tournament_stats || {};
  const statKeys = Object.keys(firstPlayerStats).filter(
    (k) => k !== "played_maps"
  );
  const tournamentStatKeys = Object.keys(firstPlayerTournamentStats).filter(
    (k) => k !== "played_maps"
  );
  const mapNames = Array.from(
    new Set(
      team.roster.flatMap((player) => {
        const statsMaps =
          Object.keys(
            playerStatsById[player.player_id]?.stats?.played_maps || {}
          );
        const tournamentMaps =
          Object.keys(
            playerStatsById[player.player_id]?.tournament_stats?.played_maps ||
              {}
          );
        return [...statsMaps, ...tournamentMaps];
      })
    )
  );

  return (
    <>
    {renderTournamentMapChart(team)}  {/* 🔹 Added tournament map chart */}

      {renderMapChart(team)}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Faceit Level</TableCell>
              <TableCell>K/D</TableCell>
              <TableCell>K/R</TableCell>
              <TableCell>HS%</TableCell>
              {statKeys.map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              {tournamentStatKeys.map((key) => (
                <TableCell key={`tournament-${key}`}>
                  {key} (Tournament)
                </TableCell>
              ))}
              {mapNames.map((map) => (
                <TableCell key={`map-${map}`}>{map}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRoster.map((player) => {
              const stats = playerStatsById[player.player_id]?.stats || {};
              const tStats =
                playerStatsById[player.player_id]?.tournament_stats || {};
              const statsMap = stats.played_maps || {};
              const tournamentMap = tStats.played_maps || {};
              const { kd, kr, hsPercent } = calculateBasicStats(stats);
              return (
                <TableRow key={player.player_id}>
                  <TableCell>{player.nickname}</TableCell>
                  <TableCell>
                    <Chip
                      label={player.game_skill_level ?? player.faceit_lvl}
                      size="small"
                      sx={{
                        backgroundColor:
                          Number(player.game_skill_level ?? player.faceit_lvl) >=
                          8
                            ? "red"
                            : Number(
                                player.game_skill_level ?? player.faceit_lvl
                              ) >= 6
                            ? "orange"
                            : "green",
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell>{kd}</TableCell>
                  <TableCell>{kr}</TableCell>
                  <TableCell>{hsPercent}%</TableCell>
                  {statKeys.map((key) => (
                    <TableCell key={key}>{stats[key] ?? 0}</TableCell>
                  ))}
                  {tournamentStatKeys.map((key) => (
                    <TableCell key={`tournament-${key}`}>
                      {tStats[key] ?? 0}
                    </TableCell>
                  ))}
                  {mapNames.map((map) => (
                    <TableCell key={`map-${map}`}>
                      {statsMap[map] ?? 0} / {tournamentMap[map] ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};


  const displayTeams = selectedTeam
    ? teams.filter((team) => team.name === selectedTeam)
    : teams;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Teams and Players
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="team-select-label">Select Team</InputLabel>
        <Select
          labelId="team-select-label"
          id="team-select"
          value={selectedTeam}
          label="Select Team"
          onChange={handleTeamSelect}
        >
          <MenuItem value="">
            <em>All Teams</em>
          </MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.name} value={team.name}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {displayTeams.length === 0 && <Typography>No teams found.</Typography>}

      {displayTeams.map((team) => (
        <Box key={team.name} mb={5}>


          {expandedTeam === team.name || selectedTeam
            ? renderTeamTable(team)
            : null}
        </Box>
      ))}
    </Box>
  );
};

export default TeamPlayersTable;
