'use client';
import { useState, useEffect } from 'react';

export default function SessionsPage() {
  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // Form State
  const [date, setDate] = useState('');
  const [sport, setSport] = useState('');
  const [attendance, setAttendance] = useState({}); // Example: { 'playerId1': 'Present', 'playerId2': 'Absent' }
  const [loading, setLoading] = useState(false);

  // Initial data load
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

  // Jab coach koi sport type kare, hum sirf us sport ke players filter karenge
  const filteredPlayers = players.filter(p => p.sport.toLowerCase() === sport.toLowerCase().trim());

  // Handle Radio Button change
  const handleAttendanceChange = (playerId, status) => {
    setAttendance(prev => ({ ...prev, [playerId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (filteredPlayers.length === 0) {
      alert("No players found for this sport.");
      return;
    }

    // Check ki sabki attendance mark hui hai ya nahi
    const unmarkedPlayers = filteredPlayers.filter(p => !attendance[p._id]);
    if (unmarkedPlayers.length > 0) {
      alert("Please mark attendance for ALL players before saving.");
      return;
    }

    setLoading(true);

    // Backend bhejte waqt data format karna (Array of objects)
    const attendanceArray = filteredPlayers.map(p => ({
      player: p._id,
      status: attendance[p._id]
    }));

    const res = await fetch('/api/coach/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, sport, attendance: attendanceArray }),
    });

    if (res.ok) {
      alert('Session saved successfully!');
      setDate('');
      setSport('');
      setAttendance({});
      fetchSessions(); // List update karo
    } else {
      alert('Error saving session');
    }
    setLoading(false);
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

          {/* Attendance Sheet (Only visible if sport matches players) */}
          {sport && filteredPlayers.length > 0 && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Mark Attendance</h3>
              <div className="space-y-3">
                {filteredPlayers.map(player => (
                  <div key={player._id} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                    <span className="font-medium text-gray-800">{player.name}</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 cursor-pointer text-green-700">
                        <input 
                          type="radio" 
                          name={`attendance-${player._id}`} 
                          checked={attendance[player._id] === 'Present'}
                          onChange={() => handleAttendanceChange(player._id, 'Present')}
                        /> Present
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer text-red-600">
                        <input 
                          type="radio" 
                          name={`attendance-${player._id}`} 
                          checked={attendance[player._id] === 'Absent'}
                          onChange={() => handleAttendanceChange(player._id, 'Absent')}
                        /> Absent
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sport && filteredPlayers.length === 0 && (
            <p className="text-red-500 text-sm">No players found for '{sport}'. Ensure the spelling is correct.</p>
          )}

          <button type="submit" disabled={loading || filteredPlayers.length === 0} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 mt-4">
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
                    Total Players: {session.attendance.length} | 
                    Present: {session.attendance.filter(a => a.status === 'Present').length} | 
                    Absent: {session.attendance.filter(a => a.status === 'Absent').length}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${session.isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {session.isClosed ? 'Locked' : 'Open'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}