/* eslint-disable react/prop-types */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box, useTheme, alpha } from "@mui/material";

const MapBarChart = ({ allmatches }) => {
  const theme = useTheme();

  if (!allmatches?.aggregatedResults) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
        <Typography variant="h6" color="text.secondary">
          No aggregated results available
        </Typography>
      </Paper>
    );
  }

  // Flatten the picks and bans per map across all teams
  const mapCounts = {};

  Object.values(allmatches.aggregatedResults).forEach((teamData) => {
    if (teamData.picks) {
      Object.entries(teamData.picks).forEach(([map, count]) => {
        if (!mapCounts[map]) mapCounts[map] = { map, picks: 0, bans: 0 };
        mapCounts[map].picks += count;
      });
    }
    if (teamData.bans) {
      Object.entries(teamData.bans).forEach(([map, count]) => {
        if (!mapCounts[map]) mapCounts[map] = { map, picks: 0, bans: 0 };
        mapCounts[map].bans += count;
      });
    }
  });

  const data = Object.values(mapCounts)
    .map((m) => ({
      map: m.map.replace("de_", ""),
      picks: m.picks,
      bans: m.bans,
      total: m.picks + m.bans,
    }))
    .filter((m) => m.total > 0) // Only include maps with data
    .sort((a, b) => b.total - a.total);

  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
        <Typography variant="h6" color="text.secondary">
          No pick or ban data available
        </Typography>
      </Paper>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: '2px',
                }}
              />
              <Typography variant="body2">
                {entry.name}: <strong>{entry.value}</strong>
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Total: <strong>{payload.reduce((sum, entry) => sum + entry.value, 0)}</strong>
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: entry.color,
                borderRadius: '3px',
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: '500' }}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 500,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: '600',
          color: theme.palette.text.primary,
        }}
      >
        Pick Bans
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <XAxis
            type="number"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="map"
            tick={{ fill: theme.palette.text.primary, fontSize: 12, fontWeight: 500 }}
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Bar
            dataKey="picks"
            name="Picks"
            fill={theme.palette.success.main}
            radius={[0, 4, 4, 0]}
            barSize={35}
          />
          <Bar
            dataKey="bans"
            name="Bans"
            fill={theme.palette.error.main}
            radius={[0, 4, 4, 0]}
            barSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MapBarChart;
