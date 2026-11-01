'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CoachDashboard() {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', sport: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Deep Player Analysis
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

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
      toast.success('Player registered successfully!');
    } else {
      toast.error('Error adding player');
    }
    setLoading(false);
  };

  const handleViewDetails = async (playerId) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/coach/players/${playerId}/stats`);
      const data = await res.json();
      if (res.ok) {
        setSelectedDetails(data);
      } else {
        toast.error(data.error || 'Could not load details');
      }
    } catch (error) {
      toast.error('Error fetching player details');
    }
    setDetailsLoading(false);
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
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-white/50 text-gray-800 text-sm border-b border-gray-200">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Age</th>
                  <th className="p-4 font-bold">Sport</th>
                  <th className="p-4 font-bold">Username</th>
                  <th className="p-4 font-bold text-center">Analysis</th>
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
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleViewDetails(player._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No matching players found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOADING SPINNER FOR MODAL */}
      {detailsLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl shadow-xl flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-bold text-gray-800 text-sm">Loading Player Analytics...</span>
          </div>
        </div>
      )}

      {/* PLAYER DETAILS & ANALYTICS MODAL */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedDetails(null)}
              className="absolute top-5 right-5 bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold flex items-center justify-center transition"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6 pr-10">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 capitalize">{selectedDetails.player.name}</h3>
                <p className="text-sm text-gray-600">
                  Sport: <span className="font-bold text-indigo-700">{selectedDetails.player.sport}</span> | Age: {selectedDetails.player.age} | Login: <span className="font-mono text-blue-600">{selectedDetails.player.username}</span>
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${selectedDetails.stats.isReady ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-orange-100 text-orange-800 border border-orange-300'}`}>
                {selectedDetails.stats.isReady ? '✓ READY FOR SCOUT' : '⏳ NOT READY YET'}
              </span>
            </div>

            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-indigo-50/80 border border-indigo-100 p-3.5 rounded-2xl text-center">
                <p className="text-xs font-bold text-indigo-600 uppercase">Attendance</p>
                <p className="text-2xl font-black text-indigo-900 mt-1">{selectedDetails.stats.attendancePercentage}%</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{selectedDetails.stats.presentSessions}/{selectedDetails.stats.totalSessions} Locked</p>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 p-3.5 rounded-2xl text-center">
                <p className="text-xs font-bold text-blue-600 uppercase">Matches</p>
                <p className="text-2xl font-black text-blue-900 mt-1">{selectedDetails.stats.matchesPlayed}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Min 2 Required</p>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-100 p-3.5 rounded-2xl text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase">Total Score</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">{selectedDetails.stats.totalScore}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">All Matches</p>
              </div>
              <div className="bg-purple-50/80 border border-purple-100 p-3.5 rounded-2xl text-center">
                <p className="text-xs font-bold text-purple-600 uppercase">Avg Score</p>
                <p className="text-2xl font-black text-purple-900 mt-1">{selectedDetails.stats.avgScore}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Per Match</p>
              </div>
            </div>

            {/* History Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Attendance Log */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Enrolled Sessions ({selectedDetails.attendanceHistory.length})</h4>
                {selectedDetails.attendanceHistory.length === 0 ? (
                  <p className="text-xs text-gray-400">No sessions recorded since registration.</p>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {selectedDetails.attendanceHistory.map(att => (
                      <div key={att._id} className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border text-xs">
                        <div>
                          <span className="font-bold text-gray-700">{new Date(att.date).toLocaleDateString()}</span>
                          {!att.isClosed && <span className="ml-1.5 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-semibold">Open</span>}
                        </div>
                        <span className={`font-extrabold ${att.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Match Log */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Match Performances ({selectedDetails.matchHistory.length})</h4>
                {selectedDetails.matchHistory.length === 0 ? (
                  <p className="text-xs text-gray-400">No matches played yet.</p>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {selectedDetails.matchHistory.map(m => (
                      <div key={m._id} className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border text-xs">
                        <div>
                          <p className="font-bold text-gray-800">vs {m.opponent}</p>
                          <p className="text-[10px] text-gray-500">{new Date(m.date).toLocaleDateString()}</p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-lg">
                          {m.score} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


// 'use client';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function CoachDashboard() {
//   const [players, setPlayers] = useState([]);
//   const [formData, setFormData] = useState({ name: '', age: '', sport: '' });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modal States for Player Analytics
//   const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);
//   const [analyticsLoading, setAnalyticsLoading] = useState(false);

//   const fetchPlayers = async () => {
//     const res = await fetch('/api/coach/players');
//     const data = await res.json();
//     setPlayers(data);
//   };

//   useEffect(() => {
//     fetchPlayers();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch('/api/coach/players', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });

//     if (res.ok) {
//       setFormData({ name: '', age: '', sport: '' });
//       fetchPlayers();
//       toast.success('Player registered successfully!');
//     } else {
//       toast.error('Error adding player');
//     }
//     setLoading(false);
//   };

//   // Fetch individual player stats for Modal
//   const fetchPlayerAnalytics = async (playerId) => {
//     setAnalyticsLoading(true);
//     try {
//       const res = await fetch(`/api/coach/players/${playerId}/stats`);
//       const data = await res.json();
//       if (res.ok) {
//         setSelectedPlayerStats(data);
//       } else {
//         toast.error(data.error || 'Failed to fetch player analytics');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     }
//     setAnalyticsLoading(false);
//   };

//   const filteredPlayers = players.filter((player) =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     player.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     player.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
//       {/* Left Column: Form */}
//       <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 h-fit transition-all duration-300 hover:shadow-2xl">
//         <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
//           Add New Player
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
//             <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Enter full name" />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
//             <input type="number" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g., 18" />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
//             <input type="text" required value={formData.sport} onChange={e => setFormData({ ...formData, sport: e.target.value })} className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g., Cricket" />
//           </div>
//           <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg disabled:opacity-70 transition-all flex justify-center items-center gap-2 mt-2">
//             {loading && (
//               <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//             )}
//             {loading ? 'Processing...' : 'Register Player'}
//           </button>
//         </form>
//       </div>

//       {/* Right Column: Player List Table */}
//       <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h2 className="text-2xl font-extrabold text-gray-900">Academy Roster</h2>

//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search name, sport..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-white/50 border border-gray-200 p-2 pl-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-900"
//             />
//             <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//           </div>
//         </div>

//         {players.length === 0 ? (
//           <div className="text-center p-10 bg-white/40 rounded-2xl border border-dashed border-gray-300">
//             <p className="text-gray-500 font-medium">No players registered yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-2xl border border-gray-100/50 bg-white/30 shadow-inner">
//             <table className="w-full text-left border-collapse min-w-[500px]">
//               <thead>
//                 <tr className="bg-white/50 text-gray-800 text-sm border-b border-gray-200">
//                   <th className="p-4 font-bold">Name</th>
//                   <th className="p-4 font-bold">Sport</th>
//                   <th className="p-4 font-bold">Credentials</th>
//                   <th className="p-4 font-bold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPlayers.length > 0 ? (
//                   filteredPlayers.map((player) => (
//                     <tr key={player._id} className="border-b border-gray-100/50 hover:bg-white/60 transition-colors duration-200 text-sm">
//                       <td className="p-4">
//                         <p className="font-bold text-gray-900">{player.name}</p>
//                         <p className="text-xs text-gray-500">Age: {player.age}</p>
//                       </td>
//                       <td className="p-4">
//                         <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md font-semibold text-xs">{player.sport}</span>
//                       </td>
//                       <td className="p-4 font-mono text-xs text-blue-700">{player.username}</td>
//                       <td className="p-4 text-center">
//                         <button
//                           onClick={() => fetchPlayerAnalytics(player._id)}
//                           className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow transition"
//                         >
//                           View Analytics
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="p-8 text-center text-gray-500">No matching players found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ANALYTICS MODAL */}
//       {selectedPlayerStats && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
//           <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white max-w-lg w-full relative animate-in fade-in zoom-in-95 duration-200">
//             <button
//               onClick={() => setSelectedPlayerStats(null)}
//               className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-700 transition"
//             >
//               ✕
//             </button>

//             <div className="mb-6">
//               <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Player Profile</span>
//               <h3 className="text-3xl font-black text-gray-900 mt-2">{selectedPlayerStats.player.name}</h3>
//               <p className="text-sm text-gray-600">Sport: <span className="font-bold text-indigo-700">{selectedPlayerStats.player.sport}</span> | Age: {selectedPlayerStats.player.age}</p>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-center">
//                 <p className="text-xs font-bold text-indigo-600 uppercase">Attendance</p>
//                 <p className="text-3xl font-black text-indigo-900 mt-1">{selectedPlayerStats.stats.attendancePercentage}%</p>
//                 <p className="text-xs text-gray-500 mt-1">{selectedPlayerStats.stats.presentSessions} / {selectedPlayerStats.stats.totalSessions} Sessions</p>
//               </div>

//               <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center">
//                 <p className="text-xs font-bold text-blue-600 uppercase">Matches Played</p>
//                 <p className="text-3xl font-black text-blue-900 mt-1">{selectedPlayerStats.stats.matchesPlayed}</p>
//                 <p className="text-xs text-gray-500 mt-1">Target: &ge; 2 Matches</p>
//               </div>
//             </div>

//             <div className="p-4 rounded-2xl border flex justify-between items-center bg-gray-50">
//               <div>
//                 <p className="text-xs text-gray-500 font-bold uppercase">Scouting Eligibility</p>
//                 <p className="font-extrabold text-gray-800 text-sm">Rule: 75% Attendance + 2 Matches</p>
//               </div>
//               <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${selectedPlayerStats.stats.isReady ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
//                 {selectedPlayerStats.stats.isReady ? 'READY 🎯' : 'NOT READY ⏳'}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loading overlay for modal */}
//       {analyticsLoading && (
//         <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-50 flex justify-center items-center">
//           <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
//             <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//             <span className="font-bold text-gray-800 text-sm">Analyzing player records...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }