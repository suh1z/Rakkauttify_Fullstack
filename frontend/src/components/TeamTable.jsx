/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const TeamTable = ({ allmatches, sortBy, sortOrder, handleSort }) => {
  const renderMapList = (maps, label) => {
    if (!maps || Object.keys(maps).length === 0) {
      return `No ${label}`;
    }

    return Object.entries(maps)
      .sort((a, b) => b[1] - a[1])
      .map(([map, count]) => (
        <div key={`${label}-${map}`}>
          {map.replace("de_", "")} ({count})
        </div>
      ));
  };

  const sortedTeams = allmatches?.aggregatedResults
    ? Object.entries(allmatches.aggregatedResults).sort((a, b) => {
        const scoreA = a[1].score;
        const scoreB = b[1].score;
        return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
      })
    : [];

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Bans</TableCell>
            <TableCell>Picks</TableCell>
            <TableCell
              onClick={() => handleSort("score")}
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Score {sortBy === "score" && (sortOrder === "asc" ? "↑" : "↓")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTeams.length > 0 ? (
            sortedTeams.map(([teamName, teamData]) => (
              <TableRow key={teamName}>
                <TableCell>
                  <strong>{teamName}</strong>
                </TableCell>
                <TableCell>{renderMapList(teamData.bans, "bans")}</TableCell>
                <TableCell>{renderMapList(teamData.picks, "picks")}</TableCell>
                <TableCell>
                  <strong>{teamData.score}</strong>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No aggregated results available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamTable;
