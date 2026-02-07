import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Container,
  useTheme,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { initializeMonths } from '../reducers/statsReducer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// CS2 Colors
const cs2 = {
  bgDark: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgHover: '#252525',
  accent: '#de6c2c',
  accentSecondary: '#4ade80',
  textPrimary: '#e5e5e5',
  textSecondary: '#888888',
  border: 'rgba(255,255,255,0.08)',
};

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const months = useSelector((state) => state.stats.months);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    dispatch(initializeMonths());  
  }, [dispatch]);

  useEffect(() => {
    if (selectedMonth) {
      const monthData = months.find((month) => month.month === selectedMonth);
      setSelectedMonthData(monthData);
    }
    else if(months && months.length > 0) {
      // Default to the second month if available (usually current month is first but sometimes index logic varies)
      // Preserving original logic: setSelectedMonth(months[1].month);
      // But adding safety check
      if (months.length > 1) {
          setSelectedMonth(months[1].month);
      } else {
          setSelectedMonth(months[0].month);
      }
    }
    
  }, [selectedMonth, months]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const columns = [
    { field: 'nickname', headerName: 'Nickname', width: 160 },
    { field: 'matchWins', headerName: 'Wins', type: 'number', width: 90 },
    { 
      field: 'matchWinPercent', 
      headerName: 'Win %', 
      type: 'number', 
      width: 110,
      valueFormatter: (value) => `${parseFloat(value || 0).toFixed(2)}%`
    },
    { field: 'matchesPlayed', headerName: 'Matches', type: 'number', width: 100 },
    { field: 'roundsPlayed', headerName: 'Rounds', type: 'number', width: 100 },
    { field: 'damageDone', headerName: 'Damage', type: 'number', width: 120 },
    { field: 'kills', headerName: 'Kills', type: 'number', width: 100 },
    { field: 'deaths', headerName: 'Deaths', type: 'number', width: 100 },
    { 
        field: 'hsPercent', 
        headerName: 'HS %', 
        type: 'number', 
        width: 110,
        valueFormatter: (value) => `${parseFloat(value || 0).toFixed(2)}%`
    },
    { field: 'kd', headerName: 'K/D', type: 'number', width: 100 },
    { field: 'killsPerRound', headerName: 'K/R', type: 'number', width: 100 },
    { 
        field: 'entryWinPercent', 
        headerName: 'Entry Win %', 
        type: 'number', 
        width: 140,
        valueFormatter: (value) => `${parseFloat(value || 0).toFixed(2)}%`
    },
    { field: 'rrating', headerName: 'Rating', type: 'number', width: 110 },
  ];

  const rows = selectedMonthData?.data?.map((row, index) => ({
    id: index, // DataGrid needs a unique id
    ...row
  })) || [];

  // Prepare Chart Data
  const topRating = [...rows].sort((a, b) => b.rrating - a.rrating).slice(0, 5);
  const topKD = [...rows].sort((a, b) => b.kd - a.kd).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: cs2.bgCard, p: 1.5, border: `1px solid ${cs2.border}` }}>
          <Typography sx={{ color: cs2.textPrimary, fontWeight: 600 }}>{label}</Typography>
          <Typography sx={{ color: cs2.accent }}>{payload[0].name}: {payload[0].value}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: cs2.bgDark, color: cs2.textPrimary }}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 3, fontWeight: 'bold' }}>
              INHOUSE TRACKING
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: cs2.textPrimary }}>
              Monthly Statistics
            </Typography>
          </Box>

          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="month-select-label" sx={{ color: cs2.textSecondary }}>Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Select Month"
              sx={{
                color: cs2.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: cs2.border },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: cs2.accent },
                '& .MuiSvgIcon-root': { color: cs2.textSecondary }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }
                }
              }}
            >
              {months.map((month) => (
                month.month !== 'players' && (
                  <MenuItem key={month.month} value={month.month} sx={{ color: cs2.textPrimary, '&:hover': { bgcolor: cs2.bgHover } }}>
                    {month.month}
                  </MenuItem>
                )
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Graphs Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>TOP PERFORMERS</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 2 }}>Top 5 Ratings</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRating} layout="vertical" margin={{ top: 5, right: 50, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={cs2.border} horizontal={false} />
                    <XAxis type="number" domain={[0, 'auto']} hide />
                    <YAxis type="category" dataKey="nickname" width={100} tick={{ fill: cs2.textSecondary }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rrating" name="Rating" fill={cs2.accent} barSize={20} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: cs2.textPrimary }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2 }}>EFFICIENCY</Typography>
                <Typography variant="h6" sx={{ color: cs2.textPrimary, mb: 2 }}>Top 5 K/D Ratio</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topKD} layout="vertical" margin={{ top: 5, right: 50, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={cs2.border} horizontal={false} />
                    <XAxis type="number" domain={[0, 'auto']} hide />
                    <YAxis type="category" dataKey="nickname" width={100} tick={{ fill: cs2.textSecondary }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="kd" name="K/D" fill={cs2.accentSecondary} barSize={20} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: cs2.textPrimary }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="overline" sx={{ color: cs2.accent, letterSpacing: 2, fontWeight: 600, mb: 2, display: 'block' }}>
          PLAYER DATA
        </Typography>

        <Paper sx={{ p: 0, bgcolor: cs2.bgCard, border: `1px solid ${cs2.border}`, overflow: 'hidden' }}>
          <Box sx={{ height: 700, width: '100%', p: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
                sorting: {
                  sortModel: [{ field: 'rrating', sort: 'desc' }],
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                color: cs2.textPrimary,
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: cs2.bgHover,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: cs2.bgDark,
                  fontWeight: 'bold',
                  color: cs2.textSecondary,
                },
                '& .MuiDataGrid-cell': {
                  borderColor: cs2.border,
                },
                '& .MuiDataGrid-footerContainer': {
                  borderColor: cs2.border,
                },
                '& .MuiTablePagination-root': {
                  color: cs2.textSecondary,
                },
                '& .MuiIconButton-root': {
                  color: cs2.textSecondary,
                },
                '& .MuiDataGrid-toolbarContainer': {
                  color: cs2.textSecondary,
                  '& .MuiButton-root': { color: cs2.accent },
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StatisticsPage;
