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


// 'use client';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function MatchesPage() {
//     const [players, setPlayers] = useState([]);
//     const [matches, setMatches] = useState([]);

//     const [date, setDate] = useState('');
//     const [sport, setSport] = useState('');
//     const [opponent, setOpponent] = useState('');
//     const [scores, setScores] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchPlayers();
//         fetchMatches();
//     }, []);

//     const fetchPlayers = async () => {
//         const res = await fetch('/api/coach/players');
//         const data = await res.json();
//         setPlayers(data);
//     };

//     const fetchMatches = async () => {
//         const res = await fetch('/api/coach/matches');
//         const data = await res.json();
//         setMatches(data);
//     };

//     const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

//     const handleScoreChange = (playerId, scoreValue) => {
//         setScores(prev => ({ ...prev, [playerId]: scoreValue }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (filteredPlayers.length === 0) return toast.error("No players found for this sport.");

//         setLoading(true);
//         const toastId = toast.loading('Saving match...');

//         const finalScoresArray = [];
//         Object.keys(scores).forEach(playerId => {
//             const score = scores[playerId];
//             if (score !== '' && score !== undefined) {
//                 finalScoresArray.push({ player: playerId, score: Number(score) });
//             }
//         });

//         if (finalScoresArray.length === 0) {
//             toast.error('Please enter score for at least one player', { id: toastId });
//             setLoading(false);
//             return;
//         }

//         const res = await fetch('/api/coach/matches', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ date, sport, opponent, scores: finalScoresArray }),
//         });

//         const data = await res.json();

//         if (res.ok) {
//             toast.success('Match saved successfully!', { id: toastId });
//             setDate(''); setSport(''); setOpponent(''); setScores({});
//             fetchMatches();
//         } else {
//             toast.error(data.error || 'Error saving match', { id: toastId, duration: 5000 });
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="space-y-8">
//             {/* Create Match Card */}
//             <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 transition-all hover:shadow-2xl">
//                 <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Record Match & Scores</h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div>
//                             <label className="block text-sm font-bold text-gray-700 mb-1">Match Date</label>
//                             <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
//                             <input type="text" placeholder="e.g., Football" required value={sport} onChange={e => setSport(e.target.value)} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-gray-700 mb-1">Opponent</label>
//                             <input type="text" required value={opponent} onChange={e => setOpponent(e.target.value)} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
//                         </div>
//                     </div>

//                     {sport && filteredPlayers.length > 0 && (
//                         <div className="mt-6 p-6 bg-white/40 rounded-2xl border border-white/60 shadow-inner">
//                             <h3 className="font-bold text-gray-800 mb-1">Player Scores</h3>
//                             <p className="text-xs font-semibold text-indigo-600 mb-4 bg-indigo-50 inline-block px-3 py-1 rounded">Leave blank for non-participants</p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {filteredPlayers.map(player => (
//                                     <div key={player._id} className="flex justify-between items-center bg-white/80 p-3 px-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all">
//                                         <span className="font-bold text-gray-900">{player.name}</span>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             placeholder="Score"
//                                             value={scores[player._id] || ''}
//                                             onChange={(e) => handleScoreChange(player._id, e.target.value)}
//                                             className="bg-gray-50 border border-gray-200 p-2 w-24 rounded-lg text-center font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                     <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-4">
//                         {loading && (
//                             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                         )}
//                         {loading ? 'Processing...' : 'Save Match'}
//                     </button>
//                 </form>
//             </div>

//             {/* Past Matches List */}
//             <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
//                 <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Match History</h2>
//                 {matches.length === 0 ? (
//                     <div className="text-center p-10 bg-white/40 rounded-2xl border border-dashed border-gray-300">
//                         <p className="text-gray-500 font-medium">No matches recorded yet.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {matches.map(match => (
//                             <div key={match._id} className="bg-white/80 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
//                                 <div className="flex justify-between items-start mb-4 border-b border-gray-200/50 pb-4">
//                                     <div>
//                                         <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">{match.sport}</span>
//                                         <p className="font-extrabold text-lg text-gray-900">{new Date(match.date).toLocaleDateString()}</p>
//                                     </div>
//                                     <div className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
//                                         vs {match.opponent}
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-2 flex-wrap mt-2">
//                                     {match.scores.map(s => (
//                                         <div key={s.player?._id || Math.random()} className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center min-w-[70px]">
//                                             <span className="text-xs text-gray-500 font-bold">{s.player?.name || 'Unknown'}</span>
//                                             <span className="text-lg font-black text-indigo-700">{s.score}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }











// 'use client';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function MatchesPage() {
//     const [players, setPlayers] = useState([]);
//     const [matches, setMatches] = useState([]);

//     const [date, setDate] = useState('');
//     const [sport, setSport] = useState('');
//     const [opponent, setOpponent] = useState('');
//     const [scores, setScores] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchPlayers();
//         fetchMatches();
//     }, []);

//     const fetchPlayers = async () => {
//         const res = await fetch('/api/coach/players');
//         const data = await res.json();
//         setPlayers(data);
//     };

//     const fetchMatches = async () => {
//         const res = await fetch('/api/coach/matches');
//         const data = await res.json();
//         setMatches(data);
//     };

//     const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

//     const handleScoreChange = (playerId, scoreValue) => {
//         setScores(prev => ({ ...prev, [playerId]: scoreValue }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (filteredPlayers.length === 0) return toast.error("No players found for this sport.");

//         setLoading(true);
//         const toastId = toast.loading('Saving match...');

//         const finalScoresArray = [];
//         Object.keys(scores).forEach(playerId => {
//             const score = scores[playerId];
//             if (score !== '' && score !== undefined) {
//                 finalScoresArray.push({ player: playerId, score: Number(score) });
//             }
//         });

//         if (finalScoresArray.length === 0) {
//             toast.error('Please enter score for at least one player', { id: toastId });
//             setLoading(false);
//             return;
//         }

//         const res = await fetch('/api/coach/matches', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ date, sport, opponent, scores: finalScoresArray }),
//         });

//         const data = await res.json();

//         if (res.ok) {
//             toast.success('Match saved successfully!', { id: toastId });
//             setDate(''); setSport(''); setOpponent(''); setScores({});
//             fetchMatches();
//         } else {
//             toast.error(data.error || 'Error saving match', { id: toastId, duration: 5000 });
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="space-y-8">
//             {/* Create Match Card */}
//             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 transition-all hover:shadow-2xl dark:hover:shadow-none">
//                 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Record Match & Scores</h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div>
//                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Match Date</label>
//                             <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Sport</label>
//                             <input type="text" placeholder="e.g., Football" required value={sport} onChange={e => setSport(e.target.value)} className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Opponent</label>
//                             <input type="text" required value={opponent} onChange={e => setOpponent(e.target.value)} className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100" />
//                         </div>
//                     </div>

//                     {sport && filteredPlayers.length > 0 && (
//                         <div className="mt-6 p-6 bg-white/40 dark:bg-slate-700/40 rounded-2xl border border-white/60 dark:border-slate-600/60 shadow-inner">
//                             <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Player Scores</h3>
//                             <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-900/30 inline-block px-3 py-1 rounded">Leave blank for non-participants</p>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {filteredPlayers.map(player => (
//                                     <div key={player._id} className="flex justify-between items-center bg-white/80 dark:bg-slate-800/80 p-3 px-5 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
//                                         <span className="font-bold text-slate-900 dark:text-slate-100">{player.name}</span>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             placeholder="Score"
//                                             value={scores[player._id] || ''}
//                                             onChange={(e) => handleScoreChange(player._id, e.target.value)}
//                                             className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-2 w-24 rounded-lg text-center font-bold focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                     <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-4">
//                         {loading && (
//                             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                         )}
//                         {loading ? 'Processing...' : 'Save Match'}
//                     </button>
//                 </form>
//             </div>

//             {/* Past Matches List */}
//             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50">
//                 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Match History</h2>
//                 {matches.length === 0 ? (
//                     <div className="text-center p-10 bg-white/40 dark:bg-slate-700/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
//                         <p className="text-slate-500 dark:text-slate-400 font-medium">No matches recorded yet.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {matches.map(match => (
//                             <div key={match._id} className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
//                                 <div className="flex justify-between items-start mb-4 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
//                                     <div>
//                                         <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">{match.sport}</span>
//                                         <p className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{new Date(match.date).toLocaleDateString()}</p>
//                                     </div>
//                                     <div className="bg-gradient-to-r from-slate-800 to-black dark:from-slate-700 dark:to-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
//                                         vs {match.opponent}
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-2 flex-wrap mt-2">
//                                     {match.scores.map(s => (
//                                         <div key={s.player?._id || Math.random()} className="bg-white dark:bg-slate-700 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm flex flex-col items-center min-w-[70px]">
//                                             <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{s.player?.name || 'Unknown'}</span>
//                                             <span className="text-lg font-black text-indigo-700 dark:text-indigo-400">{s.score}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }