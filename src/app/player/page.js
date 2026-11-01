'use client';
import { useState, useEffect } from 'react';

export default function PlayerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await fetch('/api/player/me');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading your profile...</div>;
  if (!data) return <div className="text-center mt-10 text-red-500">Failed to load data.</div>;

  const { profile, stats, attendanceHistory, matchHistory } = data;

  return (
    <div className="space-y-6">
      
      {/* Profile & Ready Status Banner */}
      <div className={`p-6 rounded-lg shadow border flex justify-between items-center ${stats.isReady ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">Welcome, {profile.name}</h2>
          <p className="text-gray-600">Age: {profile.age} | Sport: <span className="font-semibold">{profile.sport}</span></p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Academy Status</p>
          {stats.isReady ? (
            <span className="bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow">READY FOR SCOUTING</span>
          ) : (
            <span className="bg-orange-400 text-white font-bold py-2 px-4 rounded-full shadow">NOT READY YET</span>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-gray-500 font-semibold mb-2">Attendance Percentage</p>
          <p className="text-4xl font-black text-purple-700">{stats.attendancePercentage}%</p>
          <p className="text-xs text-gray-400 mt-2">Target: 75% or higher</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-gray-500 font-semibold mb-2">Matches Played</p>
          <p className="text-4xl font-black text-blue-700">{stats.matchesPlayed}</p>
          <p className="text-xs text-gray-400 mt-2">Target: 2 or more</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance History */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Attendance</h3>
          {attendanceHistory.length === 0 ? (
             <p className="text-gray-500 text-sm">No locked sessions found.</p>
          ) : (
            <div className="space-y-3">
              {attendanceHistory.map(record => (
                <div key={record._id} className="flex justify-between items-center text-sm border-b pb-2">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span className={`font-bold ${record.status === 'Present' ? 'text-green-600' : 'text-red-500'}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Match History */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Match Records</h3>
          {matchHistory.length === 0 ? (
             <p className="text-gray-500 text-sm">No matches played yet.</p>
          ) : (
            <div className="space-y-3">
              {matchHistory.map(match => (
                <div key={match._id} className="flex justify-between items-center text-sm border-b pb-2">
                  <span>vs <strong>{match.opponent}</strong> ({new Date(match.date).toLocaleDateString()})</span>
                  <span className="bg-gray-100 px-3 py-1 rounded font-bold text-gray-800 border">
                    Score: {match.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}