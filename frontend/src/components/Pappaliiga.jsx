import React, { useState, useEffect } from 'react';
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
import { fetchTeams, fetchPlayer, fetchMatches, fetchPickBans, fetchAllMatches } from '../reducers/pappaReducer';


const Pappaliiga = () => {
    const dispatch = useDispatch();

    const { teams, loading, player, matches, allmatches, pickBans = {}, error: errorPlayer } = useSelector(
        (state) => state.pappa || {}
    );

    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(7);
    const [expandedPlayer, setExpandedPlayer] = useState(null);
    const [matchFilter, setMatchFilter] = useState('FINISHED'); 
    const [sortBy, setSortBy] = useState('score');
    const [sortOrder, setSortOrder] = useState('desc');
    const playerdata = player || {};

    useEffect(() => {
        dispatch(fetchTeams(selectedDivision, 11));
        dispatch(fetchMatches(selectedDivision, 11));
        dispatch(fetchAllMatches(selectedDivision, 11));
    }, [dispatch, selectedDivision]);

    const handleMatchClick = (round, matchId) => (e) => {
        e.preventDefault();
        if (selectedMatch === matchId) {
            setSelectedMatch(null);
        } else {
            setSelectedMatch(matchId);
            dispatch(fetchPickBans(matchId, round));
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const handlePlayerClick = (playerId) => {
        dispatch(fetchPlayer(playerId));
        setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
    };

    const handleDivisionChange = (e) => {
        const newDivision = Number(e.target.value);
        setSelectedDivision(newDivision);
    };

    const handleMatchFilterChange = (e) => {
        setMatchFilter(e.target.value);
    };

        const filteredMatches = Array.isArray(matches)
        ? matches.filter((match) => {
            if (matchFilter === 'SCHEDULED') {
                return match.status === 'SCHEDULED';
            } else if (matchFilter === 'FINISHED') {
                return match.status === 'FINISHED';
            }
            return true;
        })
        : []; 

    if (loading) return <p>Loading data...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
                Pappaliiga
            </Typography>
            <div style={{ padding: '20px' }}>
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
                        <option value={2}>Division 2</option>
                        <option value={6}>Division 6</option>
                        <option value={17}>Division 17</option>
                    </select>
                </div>
            </div>
            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team</TableCell>
                            <TableCell>Bans</TableCell>
                            <TableCell>Picks</TableCell>
                            <TableCell 
                                onClick={() => handleSort('score')}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allmatches?.aggregatedResults ? (
                            Object.entries(allmatches.aggregatedResults)
                                .sort((a, b) => {
                                    const scoreA = a[1].score;
                                    const scoreB = b[1].score;
                                    if (sortOrder === 'asc') {
                                        return scoreA - scoreB;
                                    }
                                    return scoreB - scoreA;
                                })
                                .map(([teamName, teamData]) => (
                                    <TableRow key={teamName}>
                                        <TableCell><strong>{teamName}</strong></TableCell>
                                        <TableCell>
                                            {Object.entries(teamData.bans)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([map, count]) => (
                                                    <div key={`${teamName}-ban-${map}`}>
                                                        {map.replace('de_', '')} ({count})
                                                    </div>
                                                ))}
                                            {Object.keys(teamData.bans).length === 0 && 'No bans'}
                                        </TableCell>
                                        <TableCell>
                                            {Object.entries(teamData.picks)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([map, count]) => (
                                                    <div key={`${teamName}-pick-${map}`}>
                                                        {map.replace('de_', '')} ({count})
                                                    </div>
                                                ))}
                                            {Object.keys(teamData.picks).length === 0 && 'No picks'}
                                        </TableCell>
                                        <TableCell><strong>{teamData.score}</strong></TableCell>
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
            <div className="mb-4">
                    <label htmlFor="matchFilter" className="block mb-2">
                        Filter Matches
                    </label>
                    <select
                        id="matchFilter"
                        value={matchFilter}
                        onChange={handleMatchFilterChange}
                        className="border p-2 rounded"
                    >
                        <option value="All">All</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="FINISHED">Finished</option>
                    </select>
                </div>
            <Typography variant="h6" style={{ marginBottom: '10px' }}>
                Matches
            </Typography>
            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
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
                                        style={{ cursor: 'pointer' }}
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
                                            <TableCell colSpan={5}>
                                                <div style={{ marginTop: '20px' }}>
                                                    <Typography variant="h6">Pick & Bans</Typography>
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
                                                                {Object.entries(pickBans).map(([team, data]) => {
                                                                    return (
                                                                        <TableRow key={team}>
                                                                            <TableCell>{team}</TableCell>
                                                                            <TableCell>{data.bans ? data.bans.join(', ') : 'No bans'}</TableCell>
                                                                            <TableCell>{data.picks ? data.picks.join(', ') : 'No picks'}</TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {selectedMatch === match.match_id && errorPlayer && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
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
                                <TableCell colSpan={5}>No matches found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Pappaliiga;
