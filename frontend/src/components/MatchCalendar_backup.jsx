/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";


const MatchCalendar = ({ matches }) => {
  const [matchFilter, setMatchFilter] = useState("FINISHED");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [pickBans, setPickBans] = useState(null);
  const [errorPlayer, setErrorPlayer] = useState(null);

  const handleMatchFilterChange = (event) => {
    setMatchFilter(event.target.value);
  };

  const handleMatchClick = (round, matchId) => () => {
    if (selectedMatch === matchId) {
      setSelectedMatch(null);
      setPickBans(null);
      setErrorPlayer(null);
    } else {
      setSelectedMatch(matchId);
      // Simulate fetching pick & bans
      try {
        // Replace with your fetch logic
        const fetchedPickBans = matches.find((m) => m.match_id === matchId)?.pickBans || null;
        setPickBans(fetchedPickBans);
        setErrorPlayer(null);
      } catch (err) {
        setErrorPlayer(err.message);
      }
    }
  };

const filteredMatches = Array.isArray(matches)
  ? matches.filter((match) => {
      if (matchFilter === 'SCHEDULED') return match.status === 'SCHEDULED';
      if (matchFilter === 'FINISHED') return match.status === 'FINISHED';
      return true;
  })
  : [];



  return (
    <Box>
      {/* Filter */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter Matches</InputLabel>
        <Select value={matchFilter} onChange={handleMatchFilterChange} label="Filter Matches">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
          <MenuItem value="FINISHED">Finished</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Matches
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View on Faceit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <React.Fragment key={match.match_id}>
                  <TableRow
                    onClick={handleMatchClick(match.round, match.match_id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <strong>{match.faction1_name} vs {match.faction2_name}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{match.faction1_score}</strong> - <strong>{match.faction2_score}</strong>
                    </TableCell>
                    <TableCell>{match.scheduled_at}</TableCell>
                    <TableCell>{match.status}</TableCell>
                    <TableCell>
                      {match.faceit_url ? (
                        <a
                          href={match.faceit_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Pick & Bans */}
                  {selectedMatch === match.match_id && pickBans && !errorPlayer && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Pick & Bans</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Team</TableCell>
                                  <TableCell>Bans</TableCell>
                                  <TableCell>Picks</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(pickBans).map(([team, data]) => (
                                  <TableRow key={team}>
                                    <TableCell>{team}</TableCell>
                                    <TableCell>{data.bans?.join(", ") || "No bans"}</TableCell>
                                    <TableCell>{data.picks?.join(", ") || "No picks"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Error handling */}
                  {selectedMatch === match.match_id && errorPlayer && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Paper sx={{ p: 2, bgcolor: "#f9f9f9", mt: 2 }}>
                          <Typography color="error">
                            Error loading Pick & Bans: {errorPlayer}
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No matches found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MatchCalendar;
