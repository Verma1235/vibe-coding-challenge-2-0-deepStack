'use client';
import { useState, useEffect } from 'react';

export default function CoachDashboard() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', sport: '' });
  const [loading, setLoading] = useState(false);

  // Database se players mangwana
  const fetchPlayers = async () => {
    const res = await fetch('/api/coach/players');
    const data = await res.json();
    setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Form submit karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/coach/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', age: '', sport: '' }); // Form khali karo
      fetchPlayers(); // List ko refresh karo
    } else {
      alert('Error adding player');
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Column: Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Player</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Age</label>
            <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sport</label>
            <input type="text" required value={formData.sport} onChange={e => setFormData({...formData, sport: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
            {loading ? 'Adding...' : 'Add Player'}
          </button>
        </form>
      </div>

      {/* Right Column: Player List Table */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Academy Players</h2>
        
        {players.length === 0 ? (
          <p className="text-gray-500">No players added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Age</th>
                  <th className="p-3 border-b">Sport</th>
                  <th className="p-3 border-b">Login Username</th>
                  <th className="p-3 border-b">Password</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-3 font-semibold text-gray-800">{player.name}</td>
                    <td className="p-3">{player.age}</td>
                    <td className="p-3">{player.sport}</td>
                    <td className="p-3 text-blue-600 font-mono">{player.username}</td>
                    <td className="p-3 text-gray-500 font-mono">player123</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}