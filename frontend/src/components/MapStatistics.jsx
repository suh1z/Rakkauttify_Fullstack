/* eslint-disable react/prop-types */
import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
  red: '#ef4444',
};

const MapStatistics = ({ allmatches }) => {
  if (!allmatches?.aggregatedResults) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
        <Typography variant="h6" sx={{ color: cs2.textSecondary }}>
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
    .filter((m) => m.total > 0)
    .sort((a, b) => b.total - a.total);

  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
        <Typography variant="h6" sx={{ color: cs2.textSecondary }}>
          No pick or ban data available
        </Typography>
      </Paper>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            p: 2,
            bgcolor: cs2.bgCard,
            border: `1px solid ${cs2.border}`,
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: cs2.textPrimary }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: cs2.textPrimary }}>
                {entry.name}: <strong>{entry.value}</strong>
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: cs2.accent }}>
            Total: <strong>{payload.reduce((sum, entry) => sum + entry.value, 0)}</strong>
          </Typography>
        </Box>
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
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: '500', color: cs2.textPrimary }}>
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
        bgcolor: cs2.bgCard,
        border: `1px solid ${cs2.border}`,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          mb: 1,
          display: 'block',
          textAlign: 'center',
          fontWeight: 'bold',
          color: cs2.accent,
          letterSpacing: 2,
        }}
      >
        MAP ANALYTICS
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: '600',
          color: cs2.textPrimary,
        }}
      >
        Pick / Ban Statistics
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <XAxis
            type="number"
            tick={{ fill: cs2.textSecondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="map"
            tick={{ fill: cs2.textPrimary, fontSize: 12, fontWeight: 500 }}
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Bar
            dataKey="picks"
            name="Picks"
            fill={cs2.green}
            radius={[0, 4, 4, 0]}
            barSize={35}
          />
          <Bar
            dataKey="bans"
            name="Bans"
            fill={cs2.red}
            radius={[0, 4, 4, 0]}
            barSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default memo(MapStatistics);
