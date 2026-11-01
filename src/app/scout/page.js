

'use client';
import { useState, useEffect } from 'react';

export default function ScoutDashboard() {
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadyPlayers = async () => {
      try {
        const res = await fetch('/api/scout/players');
        const data = await res.json();
        if (Array.isArray(data)) {
          setReadyPlayers(data);
        } else {
          setReadyPlayers([]);
        }
      } catch (error) {
        console.error(error);
        setReadyPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReadyPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 font-bold">Scanning academy for elite talent...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header Banner (Glass Card) */}
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Scouting Portal</span>
          <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">Ready Players (Elite Talent)</h2>
          <p className="text-sm text-gray-600 mt-1">Athletes who meet the rigorous academy benchmark.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black shadow-2xs">
          CRITERIA: &ge; 75% Attendance & &ge; 2 Matches
        </div>
      </div>

      {/* Players Grid or Empty State */}
      {!Array.isArray(readyPlayers) || readyPlayers.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl text-center p-12 rounded-3xl shadow-xl border border-white/50">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ∅
          </div>
          <p className="text-gray-800 font-bold text-lg">No players meet the "Ready" criteria yet.</p>
          <p className="text-sm text-gray-500 mt-1">Players need at least 75% attendance and 2 matches played to qualify.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyPlayers.map(player => (
            <div
              key={player._id}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-emerald-200/80 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              {/* Top Right Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-green-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl shadow-sm tracking-wider">
                READY 🎯
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 capitalize group-hover:text-indigo-700 transition-colors">{player.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">Age: {player.age} | Sport: <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[11px] ml-1">{player.sport}</span></p>
                </div>
              </div>

              {/* Metrics Box */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 text-center shadow-2xs">
                  <p className="text-gray-400 text-[11px] font-bold uppercase">Attendance</p>
                  <p className="text-xl font-black text-emerald-700 mt-0.5">{player.stats.attendancePercentage}%</p>
                </div>
                <div className="bg-white/90 p-3 rounded-2xl border border-blue-100 text-center shadow-2xs">
                  <p className="text-gray-400 text-[11px] font-bold uppercase">Matches</p>
                  <p className="text-xl font-black text-blue-700 mt-0.5">{player.stats.matchesPlayed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}