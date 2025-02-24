import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { fetchTeams, fetchPlayer, fetchMatches, fetchPickBans } from '../reducers/pappaReducer';

const Pappaliiga = () => {
    const dispatch = useDispatch();

    const { teams, loading, error, player, matches, pickBans, error: errorPlayer } = useSelector(
        (state) => state.pappa || {}
    );

    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(12);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [expandedPlayer, setExpandedPlayer] = useState(null);
    const playerdata = player || {};

    useEffect(() => {
        dispatch(fetchTeams(selectedDivision, 10));
        dispatch(fetchMatches(selectedDivision, 10));
    }, [dispatch, selectedDivision]);

    const handleMatchClick = (matchId) => (e) => {
        e.preventDefault();
        if (selectedMatch === matchId) {
            setSelectedMatch(null);
        } else {
            setSelectedMatch(matchId);
            dispatch(fetchPickBans(matchId));
        }
    };

    const handlePlayerClick = (playerId) => {
        setSelectedPlayerId(playerId);
        dispatch(fetchPlayer(playerId));
        setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
    };

    const handleDivisionChange = (e) => {
        setSelectedDivision(Number(e.target.value));
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
                Pappaliiga
            </Typography>
            <div style={{ padding: '20px' }}>
                {/* Division Selection Dropdown */}
                <div className="mb-4">
                    <label htmlFor="division" className="block mb-2">
                        Select Division
                    </label>
                    <select
                        id="division"
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                        className="border p-2 rounded"
                    >
                        <option value={7}>Division 7</option>
                        <option value={12}>Division 12</option>
                        <option value={20}>Division 20</option>
                    </select>
                </div>
            </div>
            <Typography variant="h6" style={{ marginBottom: '10px' }}>Teams and Players</Typography>
            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team</TableCell>
                            <TableCell>Player</TableCell>
                            <TableCell>Level</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.length > 0 ? (
                            teams.map((team) =>
                                team.roster.map((player) => (
                                    <React.Fragment key={player.player_id}>
                                        <TableRow
                                            onClick={() => handlePlayerClick(player.player_id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{team.name}</TableCell>
                                            <TableCell>{player.nickname}</TableCell>
                                            <TableCell>{player.game_skill_level}</TableCell>
                                        </TableRow>
                                        {expandedPlayer === player.player_id && player && (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Paper style={{ padding: '20px', marginTop: '10px' }}>
                                                        <Typography variant="h6">Player Details</Typography>
                                                        <Table>
                                                            <TableBody>
                                                                {/* Overall Stats */}
                                                                <TableRow>
                                                                    <TableCell colSpan={10}><strong>Overall Stats</strong></TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>Kills</TableCell>
                                                                    <TableCell>Assists</TableCell>
                                                                    <TableCell>Deaths</TableCell>
                                                                    <TableCell>MVPs</TableCell>
                                                                    <TableCell>Headshots</TableCell>
                                                                    <TableCell>Rounds</TableCell>
                                                                    <TableCell>2K</TableCell>
                                                                    <TableCell>3K</TableCell>
                                                                    <TableCell>4K</TableCell>
                                                                    <TableCell>5K</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>{playerdata.stats?.Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Assists || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Deaths || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.MVPs || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Headshots || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Rounds || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Double_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Triple_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Quadro_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.stats?.Penta_Kills || 'N/A'}</TableCell>
                                                                </TableRow>

                                                                {/* Tournament Stats */}
                                                                <TableRow>
                                                                    <TableCell colSpan={10}><strong>Tournament Stats</strong></TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>Kills</TableCell>
                                                                    <TableCell>Assists</TableCell>
                                                                    <TableCell>Deaths</TableCell>
                                                                    <TableCell>MVPs</TableCell>
                                                                    <TableCell>Headshots</TableCell>
                                                                    <TableCell>Rounds</TableCell>
                                                                    <TableCell>2K</TableCell>
                                                                    <TableCell>3K</TableCell>
                                                                    <TableCell>4K</TableCell>
                                                                    <TableCell>5K</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>{playerdata.tournament_stats?.Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Assists || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Deaths || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.MVPs || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Headshots || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Rounds || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Double_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Triple_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Quadro_Kills || 'N/A'}</TableCell>
                                                                    <TableCell>{playerdata.tournament_stats?.Penta_Kills || 'N/A'}</TableCell>
                                                                </TableRow>

                                                                <TableRow>
                                                                    <TableCell colSpan={5} style={{ padding: 0 }}>
                                                                        <Table>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell colSpan={3} style={{ width: '50%', verticalAlign: 'top' }}><strong>Map Stats (Tournament)</strong></TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>Map</TableCell>
                                                                                    <TableCell>Played</TableCell>
                                                                                </TableRow>
                                                                                {Object.entries(playerdata.stats?.played_maps || {}).map(([map, count]) => (
                                                                                    <TableRow key={`overall-${map}`}>
                                                                                        <TableCell>{map}</TableCell>
                                                                                        <TableCell>{count}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableCell>

                                                                    <TableCell colSpan={5} style={{ padding: 0 }}>
                                                                        <Table>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell colSpan={3} style={{ width: '50%', verticalAlign: 'top' }}><strong>Map Stats (Tournament)</strong></TableCell>
                                                                                </TableRow>
                                                                                <TableRow>
                                                                                    <TableCell>Map</TableCell>
                                                                                    <TableCell>Played</TableCell>
                                                                                </TableRow>
                                                                                {Object.entries(playerdata.tournament_stats?.played_maps || {}).map(([map, count]) => (
                                                                                    <TableRow key={`tournament-${map}`}>
                                                                                        <TableCell>{map}</TableCell>
                                                                                        <TableCell>{count}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9}>No teams found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" style={{ marginBottom: '10px' }}>
                Matches
            </Typography>
            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Match</TableCell>
                            <TableCell>Scheduled</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>View on Faceit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.length > 0 ? (
                            matches.map((match) => (
                                <React.Fragment key={match.match_id}>
                                    <TableRow
                                        onClick={handleMatchClick(match.match_id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <strong>{match.faction1_name} vs {match.faction2_name}</strong>
                                        </TableCell>
                                        <TableCell>{match.scheduled_at}</TableCell>
                                        <TableCell>{match.status}</TableCell>
                                        <TableCell>
                                            {match.faceit_url ? (
                                                <a
                                                    href={match.faceit_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {selectedMatch === match.match_id && pickBans && !errorPlayer && (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <div style={{ marginTop: '20px' }}>
                                                    <Typography variant="h6">Pick & Bans </Typography>
                                                    <TableContainer>
                                                        <Table>
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
                                                                        <TableCell>{data.bans.join(', ')}</TableCell>
                                                                        <TableCell>{data.picks.join(', ')}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {selectedMatch === match.match_id && errorPlayer && (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Paper className="p-4 mb-6" style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>
                                                    <Typography color="error">Error loading Pick & Bans: {errorPlayer}</Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>No matches found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Pappaliiga;
