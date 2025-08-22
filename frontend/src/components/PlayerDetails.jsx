/* eslint-disable react/prop-types */
import { Box, Typography, Table, TableBody, TableCell, TableRow, Divider } from "@mui/material";

const PlayerDetails = ({ playerStats, tournamentStats, mapStats, tournamentMapStats }) => {
  const renderStats = (title, stats) => (
    <Box mb={1}>
      <Typography variant="subtitle2">{title}</Typography>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>Kills</TableCell>
            <TableCell>{stats?.Kills || "N/A"}</TableCell>
            <TableCell>Assists</TableCell>
            <TableCell>{stats?.Assists || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Deaths</TableCell>
            <TableCell>{stats?.Deaths || "N/A"}</TableCell>
            <TableCell>MVPs</TableCell>
            <TableCell>{stats?.MVPs || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Headshots</TableCell>
            <TableCell>{stats?.Headshots || "N/A"}</TableCell>
            <TableCell>Rounds</TableCell>
            <TableCell>{stats?.Rounds || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2K</TableCell>
            <TableCell>{stats?.Double_Kills || "N/A"}</TableCell>
            <TableCell>3K</TableCell>
            <TableCell>{stats?.Triple_Kills || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4K</TableCell>
            <TableCell>{stats?.Quadro_Kills || "N/A"}</TableCell>
            <TableCell>5K</TableCell>
            <TableCell>{stats?.Penta_Kills || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Divider sx={{ my: 1 }} />
    </Box>
  );

  const renderMapStats = (title, maps) => (
    <Box mb={1}>
      <Typography variant="subtitle2">{title}</Typography>
      {maps && Object.entries(maps).length > 0 ? (
        <Table size="small">
          <TableBody>
            {Object.entries(maps).map(([map, count]) => (
              <TableRow key={map}>
                <TableCell>{map}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2">No data</Typography>
      )}
      <Divider sx={{ my: 1 }} />
    </Box>
  );

  return (
    <Box>
      {renderStats("Overall Stats", playerStats)}
      {renderStats("Tournament Stats", tournamentStats)}
      {renderMapStats("Map Stats (Overall)", mapStats)}
      {renderMapStats("Map Stats (Tournament)", tournamentMapStats)}
    </Box>
  );
};

export default PlayerDetails;
