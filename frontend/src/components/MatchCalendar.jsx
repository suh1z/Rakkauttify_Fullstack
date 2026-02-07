/* eslint-disable react/prop-types */
import { useState, memo } from "react";
import {
  Typography,
  Paper,
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Avatar
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import EventIcon from '@mui/icons-material/Event';

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentHover: '#ff7c3c',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
  green: '#4ade80',
};

const MatchCalendar = ({ matches }) => {
  const [matchFilter, setMatchFilter] = useState("FINISHED");

  const handleMatchFilterChange = (event, newFilter) => {
    if (newFilter) setMatchFilter(newFilter);
  };

  const filteredMatches = Array.isArray(matches)
  ? matches.filter((match) => {
      if (matchFilter === "FINISHED") return match.status === "FINISHED";
      if (matchFilter === "SCHEDULED") return match.status === "SCHEDULED";
      return true;
    })
  : [];

  // Sort: Finished -> Most recent first. Scheduled -> Earliest first.
  const sortedMatches = [...filteredMatches].sort((a, b) => {
      const dateA = new Date(a.scheduled_at);
      const dateB = new Date(b.scheduled_at);
      return matchFilter === "FINISHED" ? dateB - dateA : dateA - dateB;
  });

  const columns = [
      {
          field: 'date',
          headerName: 'Date',
          width: 150,
          renderCell: (params) => {
              const date = new Date(params.row.scheduled_at);
              return (
                  <Stack justifyContent="center" height="100%">
                      <Typography variant="body2" fontWeight="bold" sx={{ color: cs2.textPrimary }}>{date.toLocaleDateString()}</Typography>
                      <Typography variant="caption" sx={{ color: cs2.textSecondary }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Typography>
                  </Stack>
              );
          }
      },
      {
          field: 'matchup',
          headerName: 'Matchup',
          flex: 1,
          renderCell: (params) => (
             <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', height: '100%' }}>
                 <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                     <Typography fontWeight="bold" noWrap sx={{ color: cs2.textPrimary }}>{params.row.faction1_name}</Typography>
                     <Avatar sx={{ width: 24, height: 24, bgcolor: cs2.accent, fontSize: '0.7rem', color: cs2.textPrimary }}>{params.row.faction1_name?.[0]}</Avatar>
                 </Box>
                 
                 <Chip 
                    label={params.row.results ? `${params.row.results.score1} : ${params.row.results.score2}` : 'VS'} 
                    size="small"
                    sx={{ 
                        fontWeight: 'bold', 
                        minWidth: 60,
                        bgcolor: params.row.status === 'FINISHED' ? cs2.bgHover : cs2.accent,
                        color: cs2.textPrimary,
                        border: `1px solid ${cs2.border}`
                    }}
                 />
                 
                 <Box sx={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                     <Avatar sx={{ width: 24, height: 24, bgcolor: cs2.green, fontSize: '0.7rem', color: cs2.bgDark }}>{params.row.faction2_name?.[0]}</Avatar>
                     <Typography fontWeight="bold" noWrap sx={{ color: cs2.textPrimary }}>{params.row.faction2_name}</Typography>
                 </Box>
             </Stack>
          )
      },
      {
          field: 'map',
          headerName: 'Map',
          width: 120,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
              <Stack justifyContent="center" height="100%">
                <Chip 
                    label={params.row.voting?.map?.pick[0] || 'Unknown'} 
                    variant="outlined" 
                    size="small" 
                    sx={{ textTransform: 'capitalize', color: cs2.textSecondary, borderColor: cs2.border }} 
                />
              </Stack>
          )
      }
  ];

  const rows = sortedMatches.map((m, idx) => ({ id: idx, ...m }));

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cs2.textPrimary }}>
              <EventIcon fontSize="medium" sx={{ color: cs2.accent }}/> Match Schedule
          </Typography>
          <ToggleButtonGroup
            value={matchFilter}
            exclusive
            onChange={handleMatchFilterChange}
            aria-label="match status"
            size="small"
            sx={{ 
                bgcolor: cs2.bgCard,
                border: `1px solid ${cs2.border}`,
                '& .MuiToggleButton-root': { 
                    color: cs2.textSecondary,
                    border: 'none',
                    px: 3,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.75rem',
                    '&.Mui-selected': { 
                        bgcolor: cs2.accent, 
                        color: cs2.textPrimary,
                        '&:hover': { bgcolor: cs2.accentHover } 
                    },
                    '&:hover': { bgcolor: cs2.bgHover }
                }
            }}
          >
            <ToggleButton value="FINISHED">Completed</ToggleButton>
            <ToggleButton value="SCHEDULED">Upcoming</ToggleButton>
          </ToggleButtonGroup>
      </Box>

      {/* Modern DataGrid */}
      <Paper 
          sx={{ 
              height: 600, 
              width: '100%', 
              bgcolor: cs2.bgCard, 
              border: `1px solid ${cs2.border}`,
              overflow: 'hidden' 
          }}
      >
        <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={70}
            disableRowSelectionOnClick
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            sx={{
                border: 0,
                color: cs2.textPrimary,
                '& .MuiDataGrid-columnHeaders': {
                    bgcolor: cs2.bgDark,
                    borderBottom: `1px solid ${cs2.border}`,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1,
                    color: cs2.textSecondary
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${cs2.border}`
                },
                '& .MuiDataGrid-row:hover': {
                    bgcolor: cs2.bgHover
                },
                '& .MuiTablePagination-root': {
                    color: cs2.textSecondary
                },
                '& .MuiIconButton-root': {
                    color: cs2.textSecondary
                },
                '& .MuiDataGrid-footerContainer': {
                    borderTop: `1px solid ${cs2.border}`
                }
            }}
        />
      </Paper>
    </Box>
  );
};

export default memo(MatchCalendar);
