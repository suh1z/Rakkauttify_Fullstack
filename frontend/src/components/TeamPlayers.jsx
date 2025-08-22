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

const TeamPlayersTable = ({ teams, playerStatsById, handleTeamClick, expandedTeam }) => {
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


  const renderTeamTable = (team) => {
    if (!team.roster || team.roster.length === 0)
      return <Typography>No players found.</Typography>;

    const firstPlayerStats = playerStatsById[team.roster[0].player_id]?.stats || {};
    const firstPlayerTournamentStats =
      playerStatsById[team.roster[0].player_id]?.tournament_stats || {};

    const statKeys = Object.keys(firstPlayerStats).filter((k) => k !== "played_maps");
    const tournamentStatKeys = Object.keys(firstPlayerTournamentStats).filter(
      (k) => k !== "played_maps"
    );

    const mapNames = Array.from(
      new Set(
        team.roster.flatMap((player) => {
          const statsMaps =
            Object.keys(playerStatsById[player.player_id]?.stats?.played_maps || {});
          const tournamentMaps =
            Object.keys(
              playerStatsById[player.player_id]?.tournament_stats?.played_maps || {}
            );
          return [...statsMaps, ...tournamentMaps];
        })
      )
    );

    return (
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
                <TableCell key={`tournament-${key}`}>{key} (Tournament)</TableCell>
              ))}
              {mapNames.map((map) => (
                <TableCell key={`map-${map}`}>{map}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {team.roster.map((player) => {
              const stats = playerStatsById[player.player_id]?.stats || {};
              const tStats = playerStatsById[player.player_id]?.tournament_stats || {};
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
                          Number(player.game_skill_level ?? player.faceit_lvl) >= 8
                            ? "red"
                            : Number(player.game_skill_level ?? player.faceit_lvl) >= 6
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
                    <TableCell key={`tournament-${key}`}>{tStats[key] ?? 0}</TableCell>
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
    );
  };

  const displayTeams = selectedTeam
    ? teams.filter((team) => team.name === selectedTeam)
    : teams;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
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
          <Typography
            variant="h5"
            sx={{ mb: 2, cursor: "pointer" }}
            onClick={() => handleTeamClick(team)}
          >
            {team.name}
          </Typography>

          {expandedTeam === team.name || selectedTeam ? renderTeamTable(team) : null}
        </Box>
      ))}
    </Box>
  );
};

export default TeamPlayersTable;
