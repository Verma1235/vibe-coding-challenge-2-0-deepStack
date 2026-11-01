'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import Toast

export default function SessionsPage() {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [date, setDate] = useState('');
  const [sport, setSport] = useState('');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
    fetchSessions();
  }, []);

  const fetchPlayers = async () => {
    const res = await fetch('/api/coach/players');
    const data = await res.json();
    setPlayers(data);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/coach/sessions');
    const data = await res.json();
    setSessions(data);
  };

  const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

  const handleAttendanceChange = (playerId, status) => {
    setAttendance(prev => ({ ...prev, [playerId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filteredPlayers.length === 0) {
      return toast.error("No players found.");
    }
    const unmarkedPlayers = filteredPlayers.filter(p => !attendance[p._id]);
    if (unmarkedPlayers.length > 0) {
      return toast.error("Please mark attendance for ALL players.");
    }

    setLoading(true);
    const toastId = toast.loading('Saving session...'); // Loading toast

    const attendanceArray = filteredPlayers.map(p => ({
      player: p._id,
      status: attendance[p._id]
    }));

    const res = await fetch('/api/coach/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, sport, attendance: attendanceArray }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Session saved successfully!', { id: toastId });
      setDate(''); setSport(''); setAttendance({}); fetchSessions();
    } else {
      // Backend se jo error aayega (like duplicate session), wo yahan dikhega
      toast.error(data.error || 'Error saving session', { id: toastId });
    }
    setLoading(false);
  };

  // Custom Toast for Confirmation
  const confirmLock = async (sessionId, toastId) => {
    toast.dismiss(toastId);
    const toastLoadId = toast.loading('Locking session...');

    const res = await fetch(`/api/coach/sessions/${sessionId}`, { method: 'PATCH' });
    const data = await res.json();

    if (res.ok) {
      toast.success('Session locked permanently!', { id: toastLoadId });
      fetchSessions();
    } else {
      toast.error(data.error || 'Failed to lock session', { id: toastLoadId });
    }
  };

  const handleLockSession = (sessionId) => {
    toast((t) => (
      <div>
        <p className="font-semibold mb-2">Are you sure? This cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={() => confirmLock(sessionId, t.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Yes, Lock</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    ), { duration: Infinity }); // Jab tak user button na dabaye, toast mat hatao
  };

  return (
    <div className="space-y-6">

      {/* Create Session Card */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Practice Session & Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
              <input type="text" placeholder="e.g., Cricket" required value={sport} onChange={e => setSport(e.target.value)} className="w-full border p-2 rounded focus:ring-blue-500" />
            </div>
          </div>

          {sport && filteredPlayers.length > 0 && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Mark Attendance</h3>
              <div className="space-y-3">
                {filteredPlayers.map(player => (
                  <div key={player._id} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                    <span className="font-medium text-gray-800">{player.name}</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 cursor-pointer text-green-700">
                        <input type="radio" name={`att-${player._id}`} checked={attendance[player._id] === 'Present'} onChange={() => handleAttendanceChange(player._id, 'Present')} /> Present
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer text-red-600">
                        <input type="radio" name={`att-${player._id}`} checked={attendance[player._id] === 'Absent'} onChange={() => handleAttendanceChange(player._id, 'Absent')} /> Absent
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit" disabled={loading || filteredPlayers.length === 0} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mt-4 disabled:bg-gray-400">
            {loading ? 'Saving...' : 'Save Session & Attendance'}
          </button>
        </form>
      </div>

      {/* Past Sessions List */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Past Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session._id} className="border p-4 rounded-md flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">{new Date(session.date).toLocaleDateString()} - {session.sport}</p>
                  <p className="text-sm text-gray-600">
                    Present: {session.attendance.filter(a => a.status === 'Present').length} | 
                    Absent: {session.attendance.filter(a => a.status === 'Absent').length}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${session.isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {session.isClosed ? 'Locked' : 'Open'}
                  </span>

                  {!session.isClosed && (
                    <button 
                      onClick={() => handleLockSession(session._id)}
                      className="bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-black transition"
                    >
                      Lock Session
                    </button>
                  )}
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

// export default function SessionsPage() {
//     const [players, setPlayers] = useState([]);
//     const [sessions, setSessions] = useState([]);

//     const [date, setDate] = useState('');
//     const [sport, setSport] = useState('');
//     const [attendance, setAttendance] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchPlayers();
//         fetchSessions();
//     }, []);

//     const fetchPlayers = async () => {
//         const res = await fetch('/api/coach/players');
//         const data = await res.json();
//         setPlayers(data);
//     };

//     const fetchSessions = async () => {
//         const res = await fetch('/api/coach/sessions');
//         const data = await res.json();
//         setSessions(data);
//     };

//     const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

//     const handleAttendanceChange = (playerId, status) => {
//         setAttendance(prev => ({ ...prev, [playerId]: status }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (filteredPlayers.length === 0) return toast.error("No players found.");

//         const unmarkedPlayers = filteredPlayers.filter(p => !attendance[p._id]);
//         if (unmarkedPlayers.length > 0) return toast.error("Please mark attendance for ALL players.");

//         setLoading(true);
//         const toastId = toast.loading('Saving session...');

//         const attendanceArray = filteredPlayers.map(p => ({
//             player: p._id,
//             status: attendance[p._id]
//         }));

//         const res = await fetch('/api/coach/sessions', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ date, sport, attendance: attendanceArray }),
//         });

//         const data = await res.json();

//         if (res.ok) {
//             toast.success('Session saved successfully!', { id: toastId });
//             setDate(''); setSport(''); setAttendance({}); fetchSessions();
//         } else {
//             toast.error(data.error || 'Error saving session', { id: toastId });
//         }
//         setLoading(false);
//     };

//     const confirmLock = async (sessionId, toastId) => {
//         toast.dismiss(toastId);
//         const toastLoadId = toast.loading('Locking session...');

//         const res = await fetch(`/api/coach/sessions/${sessionId}`, { method: 'PATCH' });
//         const data = await res.json();

//         if (res.ok) {
//             toast.success('Session locked permanently!', { id: toastLoadId });
//             fetchSessions();
//         } else {
//             toast.error(data.error || 'Failed to lock session', { id: toastLoadId });
//         }
//     };

//     const handleLockSession = (sessionId) => {
//         toast((t) => (
//             <div>
//                 <p className="font-bold mb-2 text-slate-800 dark:text-slate-200">Are you sure? This cannot be undone.</p>
//                 <div className="flex gap-2">
//                     <button onClick={() => confirmLock(sessionId, t.id)} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 transition">Yes, Lock</button>
//                     <button onClick={() => toast.dismiss(t.id)} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition">Cancel</button>
//                 </div>
//             </div>
//         ), { duration: Infinity });
//     };

//     return (
//         <div className="space-y-8">
//             {/* Create Session Card */}
//             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 transition-all hover:shadow-2xl dark:hover:shadow-none">
//                 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
//                     Mark Attendance
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Session Date</label>
//                             <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Sport</label>
//                             <input type="text" placeholder="e.g., Cricket" required value={sport} onChange={e => setSport(e.target.value)} className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100" />
//                         </div>
//                     </div>

//                     {sport && filteredPlayers.length > 0 && (
//                         <div className="mt-6 p-6 bg-white/40 dark:bg-slate-700/40 rounded-2xl border border-white/60 dark:border-slate-600/60 shadow-inner">
//                             <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Player List</h3>
//                             <div className="space-y-3">
//                                 {filteredPlayers.map(player => (
//                                     <div key={player._id} className="flex justify-between items-center bg-white/80 dark:bg-slate-800/80 p-4 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
//                                         <span className="font-bold text-slate-900 dark:text-slate-100">{player.name}</span>
//                                         <div className="flex gap-4">
//                                             <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${attendance[player._id] === 'Present' ? 'bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700/50' : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
//                                                 <input type="radio" name={`att-${player._id}`} className="accent-green-600" checked={attendance[player._id] === 'Present'} onChange={() => handleAttendanceChange(player._id, 'Present')} />
//                                                 <span className={`text-sm font-bold ${attendance[player._id] === 'Present' ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>Present</span>
//                                             </label>
//                                             <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${attendance[player._id] === 'Absent' ? 'bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700/50' : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
//                                                 <input type="radio" name={`att-${player._id}`} className="accent-red-600" checked={attendance[player._id] === 'Absent'} onChange={() => handleAttendanceChange(player._id, 'Absent')} />
//                                                 <span className={`text-sm font-bold ${attendance[player._id] === 'Absent' ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>Absent</span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     <button type="submit" disabled={loading || filteredPlayers.length === 0} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-4">
//                         {loading && (
//                             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                         )}
//                         {loading ? 'Processing...' : 'Save Session'}
//                     </button>
//                 </form>
//             </div>

//             {/* Past Sessions List */}
//             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50">
//                 <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">Session History</h2>
//                 {sessions.length === 0 ? (
//                     <div className="text-center p-10 bg-white/40 dark:bg-slate-700/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
//                         <p className="text-slate-500 dark:text-slate-400 font-medium">No sessions recorded yet.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {sessions.map(session => (
//                             <div key={session._id} className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
//                                 <div className="flex justify-between items-start mb-4">
//                                     <div>
//                                         <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">{session.sport}</span>
//                                         <p className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{new Date(session.date).toLocaleDateString()}</p>
//                                     </div>
//                                     <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${session.isClosed ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' : 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'}`}>
//                                         {session.isClosed ? '🔒 LOCKED' : '🔓 OPEN'}
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
//                                     <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex gap-3">
//                                         <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">P: {session.attendance.filter(a => a.status === 'Present').length}</span>
//                                         <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">A: {session.attendance.filter(a => a.status === 'Absent').length}</span>
//                                     </div>

//                                     {!session.isClosed && (
//                                         <button onClick={() => handleLockSession(session._id)} className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-slate-600 transition-all hover:shadow-lg">
//                                             Lock Session
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }