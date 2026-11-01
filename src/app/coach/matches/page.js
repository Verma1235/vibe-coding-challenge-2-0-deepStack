'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function MatchesPage() {
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);

    const [date, setDate] = useState('');
    const [sport, setSport] = useState('');
    const [opponent, setOpponent] = useState('');
    const [scores, setScores] = useState({}); // Mapping: { playerId: score }
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlayers();
        fetchMatches();
    }, []);

    const fetchPlayers = async () => {
        const res = await fetch('/api/coach/players');
        const data = await res.json();
        setPlayers(data);
    };

    const fetchMatches = async () => {
        const res = await fetch('/api/coach/matches');
        const data = await res.json();
        setMatches(data);
    };

    const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

    const handleScoreChange = (playerId, scoreValue) => {
        setScores(prev => ({ ...prev, [playerId]: scoreValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (filteredPlayers.length === 0) return toast.error("No players found for this sport.");

        setLoading(true);
        const toastId = toast.loading('Saving match...');

        // Sirf un players ko filter karo jinka score fill kiya gaya hai (blank inputs ignore karo)
        const finalScoresArray = [];
        Object.keys(scores).forEach(playerId => {
            const score = scores[playerId];
            if (score !== '' && score !== undefined) {
                finalScoresArray.push({ player: playerId, score: Number(score) });
            }
        });

        if (finalScoresArray.length === 0) {
            toast.error('Please enter score for at least one player', { id: toastId });
            setLoading(false);
            return;
        }

        const res = await fetch('/api/coach/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, sport, opponent, scores: finalScoresArray }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success('Match saved successfully!', { id: toastId });
            setDate(''); setSport(''); setOpponent(''); setScores({});
            fetchMatches();
        } else {
            // Ye toast "Absent" wala validation error dikhayega
            toast.error(data.error || 'Error saving match', { id: toastId, duration: 5000 });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">

            {/* Create Match Card */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Record Match & Scores</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
                            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <input type="text" placeholder="e.g., Football" required value={sport} onChange={e => setSport(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                            <input type="text" required value={opponent} onChange={e => setOpponent(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500" />
                        </div>
                    </div>

                    {sport && filteredPlayers.length > 0 && (
                        <div className="mt-4 border rounded-md p-4 bg-gray-50">
                            <h3 className="font-semibold mb-2">Player Scores</h3>
                            <p className="text-xs text-gray-500 mb-3">Leave blank for players who did not participate in this match.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredPlayers.map(player => (
                                    <div key={player._id} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                                        <span className="font-medium text-gray-800">{player.name}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Score"
                                            value={scores[player._id] || ''}
                                            onChange={(e) => handleScoreChange(player._id, e.target.value)}
                                            className="border p-1 w-20 rounded text-center focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mt-4 disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Match'}
                    </button>
                </form>
            </div>

            {/* Past Matches List */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Past Matches</h2>
                {matches.length === 0 ? (
                    <p className="text-gray-500">No matches recorded yet.</p>
                ) : (
                    <div className="space-y-4">
                        {matches.map(match => (
                            <div key={match._id} className="border p-4 rounded-md bg-gray-50">
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <p className="font-bold text-gray-800">{new Date(match.date).toLocaleDateString()} - {match.sport}</p>
                                    <p className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded">vs {match.opponent}</p>
                                </div>
                                <div className="text-sm text-gray-700 flex gap-4 flex-wrap mt-2">
                                    {match.scores.map(s => (
                                        <span key={s.player?._id || Math.random()} className="bg-white px-2 py-1 border rounded">
                                            {s.player?.name}: <strong>{s.score}</strong>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}