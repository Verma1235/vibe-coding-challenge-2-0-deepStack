
'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [date, setDate] = useState('');
  const [sport, setSport] = useState('');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  // Edit Mode States
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editAttendance, setEditAttendance] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

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
    const toastId = toast.loading('Saving session...');

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
      toast.error(data.error || 'Error saving session', { id: toastId });
    }
    setLoading(false);
  };

  // --- EDIT ATTENDANCE FUNCTIONS ---
  const startEditing = (session) => {
    setEditingSessionId(session._id);
    const currentAtt = {};
    session.attendance.forEach(item => {
      const pId = item.player?._id || item.player;
      currentAtt[pId] = item.status;
    });
    setEditAttendance(currentAtt);
  };

  const handleEditAttendanceChange = (playerId, status) => {
    setEditAttendance(prev => ({ ...prev, [playerId]: status }));
  };

  const saveEditedAttendance = async (session) => {
    setSavingEdit(true);
    const toastId = toast.loading('Updating attendance...');

    const updatedArray = session.attendance.map(item => {
      const pId = item.player?._id || item.player;
      return {
        player: pId,
        status: editAttendance[pId] || item.status
      };
    });

    const res = await fetch(`/api/coach/sessions/${session._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance: updatedArray }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Attendance updated!', { id: toastId });
      setEditingSessionId(null);
      fetchSessions();
    } else {
      toast.error(data.error || 'Failed to update', { id: toastId });
    }
    setSavingEdit(false);
  };

  // --- LOCK SESSION FUNCTIONS ---
  const confirmLock = async (sessionId, toastId) => {
    toast.dismiss(toastId);
    const toastLoadId = toast.loading('Locking session...');

    const res = await fetch(`/api/coach/sessions/${sessionId}`, { method: 'PATCH' });
    const data = await res.json();

    if (res.ok) {
      toast.success('Session locked permanently!', { id: toastLoadId });
      if (editingSessionId === sessionId) setEditingSessionId(null);
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
    ), { duration: Infinity });
  };

  const todayStr = new Date().toISOString().split('T')[0];


  return (
    <div className="space-y-6">

      {/* Create Session Card */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Create Practice Session & Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Session Date</label>
              <input
                type="date"
                required
                max={todayStr}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 p-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
              <input type="text" placeholder="e.g., Cricket" required value={sport} onChange={e => setSport(e.target.value)} className="w-full bg-white/70 border border-gray-200 p-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {/* COMPACT GRID FOR MARKING ATTENDANCE */}
          {sport && filteredPlayers.length > 0 && (
            <div className="mt-4 border border-white/60 rounded-2xl p-4 bg-white/40 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-gray-800">Mark Attendance ({filteredPlayers.length} Players)</h3>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={() => {
                    const allP = {}; filteredPlayers.forEach(p => allP[p._id] = 'Present'); setAttendance(allP);
                  }} className="text-green-700 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-md font-bold transition">Mark All P</button>
                  <button type="button" onClick={() => {
                    const allA = {}; filteredPlayers.forEach(p => allA[p._id] = 'Absent'); setAttendance(allA);
                  }} className="text-red-700 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-md font-bold transition">Mark All A</button>
                </div>
              </div>

              {/* Scrollable Small Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {filteredPlayers.map(player => (
                  <div key={player._id} className="flex justify-between items-center bg-white/90 px-3 py-2 border border-gray-200/80 rounded-xl shadow-sm hover:shadow transition">
                    <span className="font-bold text-gray-800 text-sm truncate mr-2" title={player.name}>{player.name}</span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(player._id, 'Present')}
                        className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all ${attendance[player._id] === 'Present' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(player._id, 'Absent')}
                        className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all ${attendance[player._id] === 'Absent' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'}`}
                      >
                        A
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading || filteredPlayers.length === 0} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2 mt-4">
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            )}
            {loading ? 'Saving...' : 'Save Session & Attendance'}
          </button>
        </form>
      </div>

      {/* Past Sessions List */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Past Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => {
              const isEditingThis = editingSessionId === session._id;

              return (
                <div key={session._id} className="border border-gray-200/80 p-4 rounded-2xl bg-white/80 shadow-sm transition-all">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-extrabold text-gray-900">{new Date(session.date).toLocaleDateString()} - <span className="text-indigo-700 capitalize">{session.sport}</span></p>
                      <p className="text-xs font-semibold text-gray-600 mt-0.5">
                        Present: <span className="text-green-600">{session.attendance.filter(a => a.status === 'Present').length}</span> |
                        Absent: <span className="text-red-600 ml-1">{session.attendance.filter(a => a.status === 'Absent').length}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {session.isClosed ? 'Locked' : 'Open'}
                      </span>

                      {/* Show Edit & Lock buttons ONLY if session is NOT closed */}
                      {!session.isClosed && (
                        <>
                          <button
                            onClick={() => isEditingThis ? setEditingSessionId(null) : startEditing(session)}
                            className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            {isEditingThis ? 'Cancel' : 'Edit Attendance'}
                          </button>
                          <button
                            onClick={() => handleLockSession(session._id)}
                            className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black transition"
                          >
                            Lock Session
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* INLINE COMPACT EDIT GRID (Visible when 'Edit Attendance' is clicked) */}
                  {isEditingThis && !session.isClosed && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Edit Mode (Unlocked)</span>
                        <button
                          onClick={() => saveEditedAttendance(session)}
                          disabled={savingEdit}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow transition disabled:opacity-50"
                        >
                          {savingEdit ? 'Updating...' : 'Save Changes'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50/80 rounded-xl border border-gray-200/60">
                        {session.attendance.map(record => {
                          const pId = record.player?._id || record.player;
                          const pName = record.player?.name || 'Player';
                          const currentStatus = editAttendance[pId];

                          return (
                            <div key={pId} className="flex justify-between items-center bg-white px-2.5 py-1.5 border rounded-lg shadow-sm">
                              <span className="text-xs font-bold text-gray-800 truncate mr-2">{pName}</span>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditAttendanceChange(pId, 'Present')}
                                  className={`w-6 h-6 rounded text-xs font-bold transition ${currentStatus === 'Present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                                >
                                  P
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditAttendanceChange(pId, 'Absent')}
                                  className={`w-6 h-6 rounded text-xs font-bold transition ${currentStatus === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50'}`}
                                >
                                  A
                                </button>
                              </div>
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