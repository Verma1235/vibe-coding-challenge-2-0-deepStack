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
        setReadyPlayers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReadyPlayers();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading elite talent...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ready Players (Elite Talent)</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
          Strictly &ge; 75% Attendance & &ge; 2 Matches
        </span>
      </div>

      {readyPlayers.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No players meet the "Ready" criteria yet.</p>
          <p className="text-sm text-gray-400 mt-2">Players need at least 75% attendance and 2 matches played.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyPlayers.map(player => (
            <div key={player._id} className="border border-green-200 rounded-lg p-5 bg-green-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                READY
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 capitalize mb-1">{player.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Age: {player.age} | Sport: <span className="font-semibold">{player.sport}</span></p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white p-2 rounded border border-green-100">
                  <p className="text-gray-500 text-xs">Attendance</p>
                  <p className="font-bold text-lg text-green-700">{player.stats.attendancePercentage}%</p>
                </div>
                <div className="bg-white p-2 rounded border border-green-100">
                  <p className="text-gray-500 text-xs">Matches</p>
                  <p className="font-bold text-lg text-blue-700">{player.stats.matchesPlayed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}