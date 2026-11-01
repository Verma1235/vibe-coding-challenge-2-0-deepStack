'use client';
import { useState, useEffect } from 'react';

export default function CoachDashboard() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', sport: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  const fetchPlayers = async () => {
    const res = await fetch('/api/coach/players');
    const data = await res.json();
    setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/coach/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', age: '', sport: '' });
      fetchPlayers();
    } else {
      alert('Error adding player');
    }
    setLoading(false);
  };

  // Filter players based on search term
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form (Glass Card) */}
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 h-fit transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          Add New Player
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Enter full name" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
            <input type="number" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g., 18" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
            <input type="text" required value={formData.sport} onChange={e => setFormData({ ...formData, sport: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g., Cricket" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-2">
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing...' : 'Register Player'}
          </button>
        </form>
      </div>

      {/* Right Column: Player List Table (Glass Card) */}
      <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">Academy Roster</h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search name, sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 p-2 pl-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-gray-900"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="text-center p-10 bg-white/40 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No players registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100/50 bg-white/30 shadow-inner">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/50 text-gray-800 text-sm border-b border-gray-200">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Age</th>
                  <th className="p-4 font-bold">Sport</th>
                  <th className="p-4 font-bold">Username</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <tr key={player._id} className="border-b border-gray-100/50 hover:bg-white/60 transition-colors duration-200 text-sm">
                      <td className="p-4 font-bold text-gray-900">{player.name}</td>
                      <td className="p-4 text-gray-700">{player.age}</td>
                      <td className="p-4 text-gray-700">
                        <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md font-semibold text-xs">{player.sport}</span>
                      </td>
                      <td className="p-4 text-blue-700 font-mono font-medium">{player.username}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No matching players found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}