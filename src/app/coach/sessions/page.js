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