import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, fetchPlayer, fetchMatches, fetchPickBans } from "../reducers/pappaReducer";

const Pappaliiga = () => {
    const dispatch = useDispatch();

    const { teams, loading, error, player, matches, pickBans, error: errorPlayer } = useSelector(
        (state) => state.pappa || {}
    );

    const [selectedDivision, setSelectedDivision] = useState(12);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        dispatch(fetchTeams(selectedDivision, 10));
        dispatch(fetchMatches(selectedDivision, 10));
    }, [dispatch, selectedDivision]);

    const handleDivisionChange = (e) => {
        setSelectedDivision(e.target.value);
    };

    const handlePlayerClick = (playerId) => {
        dispatch(fetchPlayer(playerId));
    };

    const handleMatchClick = (matchId) => {
        const match = matches.find((m) => m.match_id === matchId);
        if (match && match.status === "FINISHED") {
            setSelectedMatch(matchId);
            dispatch(fetchPickBans(matchId));
        }
    };

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content */}
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Pappaliiga</h1>

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

                {/* Teams Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Teams</h2>
                    {teams.map((team) => (
                        <div key={team.name} className="border p-4 rounded-lg shadow mb-4">
                            <h3 className="text-lg font-semibold">{team.name}</h3>
                            <ul className="mt-2">
                                {team.roster.map((player) => (
                                    <li
                                        key={player.player_id}
                                        className="flex justify-between py-1 border-b cursor-pointer"
                                        onClick={() => handlePlayerClick(player.player_id)}
                                    >
                                        <span>{player.nickname}</span>
                                        <span className="text-gray-500">LVL: {player.game_skill_level}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Matches Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Matches</h2>
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <div
                                key={match.match_id}
                                className="border p-4 rounded-lg shadow mb-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleMatchClick(match.match_id)}
                            >
                                <p>
                                    <strong>Match:</strong> {match.faction1_name} vs {match.faction2_name}
                                </p>
                                <p className="text-gray-500">Status: {match.status}</p>
                                <p className="text-gray-500">Scheduled At: {match.scheduled_at}</p>
                                <p className="text-blue-500">
                                    <a href={match.faceit_url} target="_blank" rel="noopener noreferrer">
                                        View on Faceit
                                    </a>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No matches found.</p>
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1 space-y-6">
                {/* Pick & Bans Section */}
                {selectedMatch && pickBans && (
                    <div className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Pick & Bans for Match {selectedMatch}</h2>
                        <table className="w-full mt-2 border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Team</th>
                                    <th className="border p-2">Bans</th>
                                    <th className="border p-2">Picks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(pickBans).map(([team, data]) => (
                                    <tr key={team} className="border">
                                        <td className="border p-2">{team}</td>
                                        <td className="border p-2">{data.bans.join(", ")}</td>
                                        <td className="border p-2">{data.picks.join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Player Data Section */}
                {errorPlayer && <p>Error: {errorPlayer}</p>}
                {player && (
    <div className="border p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Player Data</h2>
        <p className="font-semibold">{player.nickname} (Faceit Level {player.faceit_lvl})</p>

        {/* General Stats */}
        <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Stat</th>
                    <th className="border p-2">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td className="border p-2">Matches Played</td><td className="border p-2">{player.stats.played_matches}</td></tr>
                <tr><td className="border p-2">Kills</td><td className="border p-2">{player.stats.Kills}</td></tr>
                <tr><td className="border p-2">Assists</td><td className="border p-2">{player.stats.Assists}</td></tr>
                <tr><td className="border p-2">Deaths</td><td className="border p-2">{player.stats.Deaths}</td></tr>
                <tr><td className="border p-2">MVPs</td><td className="border p-2">{player.stats.MVPs}</td></tr>
                <tr><td className="border p-2">Headshots</td><td className="border p-2">{player.stats.Headshots}</td></tr>
                <tr><td className="border p-2">Rounds Played</td><td className="border p-2">{player.stats.Rounds}</td></tr>
            </tbody>
        </table>

        {/* Map Performance */}
        <h3 className="text-lg font-semibold mt-4">Map Performance</h3>
        <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Map</th>
                    <th className="border p-2">Played</th>
                    <th className="border p-2">Wins</th>
                    <th className="border p-2">Win %</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(player.stats.played_maps).map((map) => {
                    if (!map.includes("_wins")) {
                        const wins = player.stats.played_maps[`${map}_wins`] || 0;
                        const played = player.stats.played_maps[map] || 0;
                        const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : "0.0";
                        return (
                            <tr key={map}>
                                <td className="border p-2">{map.replace("de_", "").toUpperCase()}</td>
                                <td className="border p-2">{played}</td>
                                <td className="border p-2">{wins}</td>
                                <td className="border p-2">{winRate}%</td>
                            </tr>
                        );
                    }
                    return null;
                })}
            </tbody>
        </table>

        {/* Tournament Stats */}
        <h3 className="text-lg font-semibold mt-4">Tournament Stats</h3>
        <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Stat</th>
                    <th className="border p-2">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td className="border p-2">Matches Played</td><td className="border p-2">{player.tournament_stats.played_matches}</td></tr>
                <tr><td className="border p-2">Kills</td><td className="border p-2">{player.tournament_stats.Kills}</td></tr>
                <tr><td className="border p-2">Assists</td><td className="border p-2">{player.tournament_stats.Assists}</td></tr>
                <tr><td className="border p-2">Deaths</td><td className="border p-2">{player.tournament_stats.Deaths}</td></tr>
                <tr><td className="border p-2">MVPs</td><td className="border p-2">{player.tournament_stats.MVPs}</td></tr>
                <tr><td className="border p-2">Headshots</td><td className="border p-2">{player.tournament_stats.Headshots}</td></tr>
                <tr><td className="border p-2">Rounds Played</td><td className="border p-2">{player.tournament_stats.Rounds}</td></tr>
            </tbody>
        </table>
    </div>
)}

            </div>
        </div>
    );
};

export default Pappaliiga;
