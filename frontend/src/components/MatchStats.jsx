import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMatch } from '../reducers/statsReducer';
import { 
  Paper, 
  Typography, 
  Box, 
  Container, 
  Avatar, 
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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
  yellow: '#facc15',
  red: '#ef4444',
  team1: 'rgba(222, 108, 44, 0.12)',
  team1Hover: 'rgba(222, 108, 44, 0.2)',
  team2: 'rgba(74, 222, 128, 0.08)',
  team2Hover: 'rgba(74, 222, 128, 0.15)',
};

// eslint-disable-next-line react/prop-types
const MatchStats = ({ matchId, url }) => {
    const dispatch = useDispatch();
    const matchData = useSelector((state) => state.stats.match);
    
    useEffect(() => {
      if (matchId && url) {
        dispatch(initializeMatch(matchId, url)); 
      }
    }, [dispatch, matchId, url]);
  
    if (!matchData || !matchData.player_scores) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ color: cs2.textSecondary }}>Loading match stats...</Typography>
        </Box>
      );
    }

    const team1Name = matchData.player_scores[0]?.team ?? 'Team 1';
    const team2Name = matchData.player_scores[9]?.team ?? 'Team 2';
    const team1Rounds = matchData.player_scores[0]?.team_rounds ?? 0;
    const team2Rounds = matchData.player_scores[9]?.team_rounds ?? 0;

    const columns = [
        { 
            field: 'avatar', 
            headerName: '', 
            width: 50,
            sortable: false,
            display: 'flex',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Avatar 
                        src={params.value} 
                        alt={params.row.nickname}
                        variant="rounded"
                        sx={{ width: 28, height: 28, bgcolor: cs2.bgHover }}
                    >
                        {params.row.nickname?.charAt(0)}
                    </Avatar>
                </Box>
            )
        },
        { 
          field: 'nickname', 
          headerName: 'Nickname', 
          flex: 1,
          minWidth: 120,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
                <Typography fontWeight="bold" variant="body2" noWrap title={params.value} sx={{ color: cs2.textPrimary }}>{params.value}</Typography>
            </Box>
          )
        },
        { field: 'kills', headerName: 'K', type: 'number', width: 50, align: 'center', headerAlign: 'center' },
        { field: 'assists', headerName: 'A', type: 'number', width: 50, align: 'center', headerAlign: 'center' },
        { field: 'deaths', headerName: 'D', type: 'number', width: 50, align: 'center', headerAlign: 'center' },
        { 
            field: 'hs_percent', 
            headerName: 'HS%', 
            type: 'number', 
            width: 60,
            align: 'center', 
            headerAlign: 'center',
            valueFormatter: (value) => `${value}%` 
        },
        { 
            field: 'kd', 
            headerName: 'K/D', 
            type: 'number', 
            width: 60,
            align: 'center', 
            headerAlign: 'center',
            valueFormatter: (value) => value ? parseFloat(value).toFixed(2) : '0.00'
        },
        { field: 'ud', headerName: 'UD', type: 'number', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'adr', headerName: 'ADR', type: 'number', width: 60, align: 'center', headerAlign: 'center' },
        { field: 'faceit_elo', headerName: 'Elo', type: 'number', width: 60, align: 'center', headerAlign: 'center' },
        { 
            field: 'rrating', 
            headerName: 'Rating', 
            type: 'number', 
            width: 80,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Chip 
                        label={params.value} 
                        size="small" 
                        sx={{ 
                            fontWeight: 'bold', 
                            height: 24,
                            bgcolor: params.value >= 1.2 ? cs2.green : params.value >= 1.0 ? cs2.yellow : 'transparent',
                            color: params.value >= 1.0 ? cs2.bgDark : cs2.textSecondary,
                            border: params.value < 1.0 ? `1px solid ${cs2.border}` : 'none'
                        }}
                    />
                </Box>
            )
        },
    ];

    const getRowClassName = (params) => {
        if (params.row.team_id === 2) return 'team-row-1';
        if (params.row.team_id === 3) return 'team-row-2';
        return '';
    };

    const rows = matchData.player_scores.map((player, index) => ({
        id: index,
        ...player
    }));

    return (
      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
         {/* Scoreboard Header */}
         <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${cs2.bgCard} 0%, ${cs2.bgDark} 100%)`, border: `1px solid ${cs2.border}` }}>
            <CardContent>
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' }, pr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}>
                         <Typography variant="h5" fontWeight="bold" noWrap sx={{ color: cs2.accent }}>{team1Name}</Typography>
                         <Typography variant="subtitle2" sx={{ color: cs2.textSecondary }}>Team 1</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mb: { xs: 1, sm: 0 } }}>
                         <Box sx={{ 
                             bgcolor: 'rgba(255,255,255,0.05)', 
                             border: `1px solid ${cs2.border}`,
                             px: 4, 
                             py: 1, 
                             minWidth: 140,
                             display: 'inline-block' 
                         }}>
                             <Typography variant="h3" fontWeight="bold" sx={{ color: cs2.textPrimary }}>
                                 {team1Rounds} : {team2Rounds}
                             </Typography>
                         </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' }, pl: { sm: 2 } }}>
                         <Typography variant="h5" fontWeight="bold" noWrap sx={{ color: cs2.green }}>{team2Name}</Typography>
                         <Typography variant="subtitle2" sx={{ color: cs2.textSecondary }}>Team 2</Typography>
                    </Grid>
                </Grid>
            </CardContent>
         </Card>

         {/* Stats Table */}
         <Paper sx={{ 
            width: '100%', 
            bgcolor: cs2.bgCard,
            border: `1px solid ${cs2.border}`,
            '& .team-row-1': { bgcolor: cs2.team1 },
            '& .team-row-1:hover': { bgcolor: cs2.team1Hover },
            '& .team-row-2': { bgcolor: cs2.team2 },
            '& .team-row-2:hover': { bgcolor: cs2.team2Hover },
         }}>
             <DataGrid
                rows={rows}
                columns={columns}
                getRowClassName={getRowClassName}
                hideFooter
                density="compact"
                autoHeight
                disableRowSelectionOnClick
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'rrating', sort: 'desc' }],
                    },
                }}
                sx={{
                    border: 0,
                    color: cs2.textPrimary,
                    '& .MuiDataGrid-cell': {
                        borderBottom: `1px solid ${cs2.border}`
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: cs2.bgDark,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        color: cs2.textSecondary,
                    }
                }}
             />
         </Paper>
      </Container>
    );
};

export default MatchStats;
