
'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function MatchesPage() {
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [date, setDate] = useState('');
    const [sport, setSport] = useState('');
    const [opponent, setOpponent] = useState('');
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPresentOnly, setShowPresentOnly] = useState(false);

    // Edit Match States
    const [editingMatchId, setEditingMatchId] = useState(null);
    const [editOpponent, setEditOpponent] = useState('');
    const [editScores, setEditScores] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        fetchPlayers();
        fetchMatches();
        fetchSessions();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/coach/players');
            const data = await res.json();
            if (Array.isArray(data)) setPlayers(data);
            else setPlayers([]);
        } catch (err) {
            setPlayers([]);
        }
    };

    const fetchMatches = async () => {
        try {
            const res = await fetch('/api/coach/matches');
            const data = await res.json();
            if (Array.isArray(data)) setMatches(data);
            else setMatches([]);
        } catch (err) {
            setMatches([]);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/coach/sessions');
            const data = await res.json();
            if (Array.isArray(data)) setSessions(data);
            else setSessions([]);
        } catch (err) {
            setSessions([]);
        }
    };

    // Helper: Format Date to YYYY-MM-DD for matching session date
    const toDateKey = (d) => {
        if (!d) return '';
        try {
            return new Date(d).toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    // Find session matching selected Date & Sport
    const findSessionForDateAndSport = (targetDate, targetSport) => {
        if (!targetDate || !targetSport || !Array.isArray(sessions)) return null;
        const dateKey = toDateKey(targetDate);
        return sessions.find(
            s =>
                toDateKey(s.date) === dateKey &&
                (s.sport || '').toLowerCase().trim() === targetSport.toLowerCase().trim()
        );
    };

    const activeSession = findSessionForDateAndSport(date, sport);

    // Get player's attendance status for a specific session
    const getAttendanceStatus = (sessionObj, playerId) => {
        if (!sessionObj || !Array.isArray(sessionObj.attendance)) return 'No Session';
        const record = sessionObj.attendance.find(a => {
            const id = a.player?._id || a.player;
            return id?.toString() === playerId?.toString();
        });
        return record ? record.status : 'Not Enrolled';
    };

    const safePlayers = Array.isArray(players) ? players : [];
    const sportPlayers = safePlayers.filter(
        p => (p?.sport || '').toLowerCase() === sport.toLowerCase().trim()
    );

    // Filter list if "Show Present Only" is checked
    const displayedPlayers = showPresentOnly
        ? sportPlayers.filter(p => getAttendanceStatus(activeSession, p._id) === 'Present')
        : sportPlayers;

    const handleScoreChange = (playerId, scoreValue) => {
        setScores(prev => ({ ...prev, [playerId]: scoreValue }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (sportPlayers.length === 0) return toast.error('No players found for this sport.');


    //     setLoading(true);
    //     const toastId = toast.loading('Saving match...');

    //     const finalScoresArray = [];
    //     Object.keys(scores).forEach(playerId => {
    //         const status = getAttendanceStatus(activeSession, playerId);
    //         // Skip if player was marked Absent
    //         if (status === 'Absent') return;

    //         const score = scores[playerId];
    //         if (score !== '' && score !== undefined) {
    //             finalScoresArray.push({ player: playerId, score: Number(score) });
    //         }
    //     });

    //     if (finalScoresArray.length === 0) {
    //         toast.error('Please enter score for at least one Present player', { id: toastId });
    //         setLoading(false);
    //         return;
    //     }

    //     try {
    //         const res = await fetch('/api/coach/matches', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ date, sport, opponent, scores: finalScoresArray }),
    //         });

    //         const data = await res.json();

    //         if (res.ok) {
    //             toast.success('Match saved successfully!', { id: toastId });
    //             setDate('');
    //             setSport('');
    //             setOpponent('');
    //             setScores({});
    //             fetchMatches();
    //         } else {
    //             toast.error(data.error || 'Error saving match', { id: toastId, duration: 5000 });
    //         }
    //     } catch (err) {
    //         toast.error('Network error while saving match', { id: toastId });
    //     }
    //     setLoading(false);
    // };

    // --- EDIT MATCH FUNCTIONS ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sportPlayers.length === 0) {
            return toast.error('No players found for this sport.');
        }

        // 1. Check if session attendance exists for this date & sport
        if (!activeSession) {
            return toast.error('Match score cannot be recorded! No practice session attendance found for this date.');
        }

        // 2. Check if the session is LOCKED (isClosed === true)
        if (!activeSession.isClosed) {
            return toast.error('Match score cannot be recorded! Please LOCK the practice session for this date first.');
        }

        // 3. Check if Present count is greater than 0
        const presentCount = Array.isArray(activeSession.attendance)
            ? activeSession.attendance.filter(a => a.status === 'Present').length
            : 0;

        if (presentCount === 0) {
            return toast.error('Match score cannot be recorded! Present count is 0 for this session.');
        }

        setLoading(true);
        const toastId = toast.loading('Saving match...');

        // 4. Strictly allow scores ONLY for 'Present' players
        const finalScoresArray = [];
        Object.keys(scores).forEach(playerId => {
            const status = getAttendanceStatus(activeSession, playerId);
            if (status !== 'Present') return;

            const score = scores[playerId];
            if (score !== '' && score !== undefined) {
                finalScoresArray.push({ player: playerId, score: Number(score) });
            }
        });

        if (finalScoresArray.length === 0) {
            toast.error('Please enter score for at least one Present player', { id: toastId });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/coach/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, sport, opponent, scores: finalScoresArray }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Match saved successfully!', { id: toastId });
                setDate('');
                setSport('');
                setOpponent('');
                setScores({});
                fetchMatches();
            } else {
                toast.error(data.error || 'Error saving match', { id: toastId, duration: 5000 });
            }
        } catch (err) {
            toast.error('Network error while saving match', { id: toastId });
        }
        setLoading(false);
    };

    const startEditingMatch = (match) => {
        setEditingMatchId(match._id);
        setEditOpponent(match.opponent || '');
        const initialScores = {};
        if (Array.isArray(match.scores)) {
            match.scores.forEach(s => {
                const pId = s.player?._id || s.player;
                if (pId) initialScores[pId] = String(s.score);
            });
        }
        setEditScores(initialScores);
    };

    const handleEditScoreChange = (playerId, val) => {
        setEditScores(prev => ({ ...prev, [playerId]: val }));
    };

    const saveEditedMatch = async (match) => {
        setSavingEdit(true);
        const toastId = toast.loading('Updating match scores...');

        const matchSession = findSessionForDateAndSport(match.date, match.sport);
        const updatedScoresArray = [];

        Object.keys(editScores).forEach(playerId => {
            const status = getAttendanceStatus(matchSession, playerId);
            if (status === 'Absent') return;

            const val = editScores[playerId];
            if (val !== '' && val !== undefined) {
                updatedScoresArray.push({ player: playerId, score: Number(val) });
            }
        });

        if (updatedScoresArray.length === 0) {
            toast.error('At least one present player must have a score', { id: toastId });
            setSavingEdit(false);
            return;
        }

        try {
            const res = await fetch(`/api/coach/matches/${match._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opponent: editOpponent, scores: updatedScoresArray }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Match scores updated!', { id: toastId });
                setEditingMatchId(null);
                fetchMatches();
            } else {
                toast.error(data.error || 'Failed to update match', { id: toastId });
            }
        } catch (err) {
            toast.error('Network error', { id: toastId });
        }
        setSavingEdit(false);
    };

    return (
        <div className="space-y-6">
            {/* Create Match Card */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Record Match & Scores</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Match Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={e => {
                                    setDate(e.target.value);
                                    setScores({});
                                }}
                                className="w-full bg-white/70 border border-gray-200 p-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
                            <input
                                type="text"
                                placeholder="e.g., Cricket"
                                required
                                value={sport}
                                onChange={e => {
                                    setSport(e.target.value);
                                    setScores({});
                                }}
                                className="w-full bg-white/70 border border-gray-200 p-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Opponent</label>
                            <input
                                type="text"
                                placeholder="e.g., Ranchi Strikers"
                                required
                                value={opponent}
                                onChange={e => setOpponent(e.target.value)}
                                className="w-full bg-white/70 border border-gray-200 p-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {sport && sportPlayers.length > 0 && (
                        <div className="mt-4 border border-white/60 rounded-2xl p-4 bg-white/40 shadow-inner">
                            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900">Player Scores</h3>
                                    <p className="text-xs text-gray-600">
                                        {activeSession
                                            ? 'Attendance found for this date! Absent players are locked from scoring.'
                                            : 'No practice session found on this date. Present/Absent labels show when a session exists.'}
                                    </p>
                                </div>

                                {activeSession && (
                                    <label className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={showPresentOnly}
                                            onChange={e => setShowPresentOnly(e.target.checked)}
                                            className="accent-indigo-600"
                                        />
                                        Show Present Only
                                    </label>
                                )}
                            </div>

                            {displayedPlayers.length === 0 ? (
                                <p className="text-xs text-center text-gray-500 py-4">No Present players found for this filter.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                                    {displayedPlayers.map(player => {
                                        const status = getAttendanceStatus(activeSession, player._id);
                                        const isAbsent = status === 'Absent';
                                        const isPresent = status === 'Present';

                                        return (
                                            <div
                                                key={player._id}
                                                className={`flex justify-between items-center p-3 border rounded-xl shadow-sm transition ${isAbsent
                                                    ? 'bg-red-50/60 border-red-200 opacity-75'
                                                    : 'bg-white/90 border-gray-200/80 hover:shadow'
                                                    }`}
                                            >
                                                <div className="min-w-0 pr-2">
                                                    <p className="font-bold text-gray-900 text-sm truncate" title={player.name}>
                                                        {player.name}
                                                    </p>
                                                    <span
                                                        className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 ${isPresent
                                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                                            : isAbsent
                                                                ? 'bg-red-100 text-red-700 border border-red-300'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        {isPresent ? '● Present' : isAbsent ? '✕ Absent' : 'No Session Log'}
                                                    </span>
                                                </div>

                                                {isAbsent ? (
                                                    <span className="text-xs font-bold text-red-600 bg-red-100/80 px-2.5 py-1.5 rounded-lg shrink-0">
                                                        Locked
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Score"
                                                        value={scores[player._id] || ''}
                                                        onChange={e => handleScoreChange(player._id, e.target.value)}
                                                        className="border border-gray-300 bg-white p-1.5 w-20 rounded-lg text-center font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none shrink-0"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2 mt-4"
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Saving...' : 'Save Match'}
                    </button>
                </form>
            </div>

            {/* Past Matches List */}
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Past Matches</h2>
                {!Array.isArray(matches) || matches.length === 0 ? (
                    <p className="text-gray-500">No matches recorded yet.</p>
                ) : (
                    <div className="space-y-4">
                        {matches.map(match => {
                            const isEditingThis = editingMatchId === match._id;
                            const matchSession = findSessionForDateAndSport(match.date, match.sport);
                            const matchSportPlayers = safePlayers.filter(
                                p => (p?.sport || '').toLowerCase() === (match.sport || '').toLowerCase().trim()
                            );

                            return (
                                <div key={match._id} className="border border-gray-200/80 p-4 rounded-2xl bg-white/80 shadow-sm">
                                    <div className="flex flex-wrap justify-between items-center gap-3 mb-3 border-b border-gray-200/70 pb-3">
                                        <div>
                                            <p className="font-extrabold text-gray-900">
                                                {new Date(match.date).toLocaleDateString()} -{' '}
                                                <span className="text-indigo-700 capitalize">{match.sport}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-xl">
                                                vs {match.opponent}
                                            </span>
                                            <button
                                                onClick={() => (isEditingThis ? setEditingMatchId(null) : startEditingMatch(match))}
                                                className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition"
                                            >
                                                {isEditingThis ? 'Cancel' : 'Edit Scores'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Normal Score View */}
                                    {!isEditingThis ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {Array.isArray(match.scores) &&
                                                match.scores.map(s => (
                                                    <span
                                                        key={s.player?._id || Math.random()}
                                                        className="bg-white px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs"
                                                    >
                                                        {s.player?.name || 'Player'}: <strong className="text-indigo-700 font-black">{s.score}</strong>
                                                    </span>
                                                ))}
                                        </div>
                                    ) : (
                                        /* INLINE EDIT MATCH SCORES VIEW */
                                        <div className="pt-2 space-y-3">
                                            <div className="flex flex-wrap justify-between items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs font-bold text-gray-700">Opponent:</label>
                                                    <input
                                                        type="text"
                                                        value={editOpponent}
                                                        onChange={e => setEditOpponent(e.target.value)}
                                                        className="border border-gray-300 bg-white px-2.5 py-1 rounded-lg text-xs font-bold"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => saveEditedMatch(match)}
                                                    disabled={savingEdit}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow transition disabled:opacity-50"
                                                >
                                                    {savingEdit ? 'Saving...' : 'Save Updated Scores'}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-xl border">
                                                {matchSportPlayers.map(p => {
                                                    const attStatus = getAttendanceStatus(matchSession, p._id);
                                                    const isAbsent = attStatus === 'Absent';
                                                    const isPresent = attStatus === 'Present';

                                                    return (
                                                        <div
                                                            key={p._id}
                                                            className={`flex justify-between items-center px-3 py-2 border rounded-xl bg-white ${isAbsent ? 'opacity-60 bg-red-50' : ''
                                                                }`}
                                                        >
                                                            <div className="min-w-0 pr-2">
                                                                <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                                                                <span
                                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPresent
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : isAbsent
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-gray-100 text-gray-600'
                                                                        }`}
                                                                >
                                                                    {isPresent ? 'Present' : isAbsent ? 'Absent' : 'No Session'}
                                                                </span>
                                                            </div>

                                                            {isAbsent ? (
                                                                <span className="text-[10px] font-bold text-red-600">Absent</span>
                                                            ) : (
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="-"
                                                                    value={editScores[p._id] ?? ''}
                                                                    onChange={e => handleEditScoreChange(p._id, e.target.value)}
                                                                    className="border border-gray-300 w-16 p-1 rounded text-center text-xs font-bold"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}