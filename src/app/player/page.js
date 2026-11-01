// 'use client';
// import { useState, useEffect } from 'react';

// export default function PlayerDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMyData = async () => {
//       try {
//         const res = await fetch('/api/player/me');
//         if (res.ok) {
//           const json = await res.json();
//           setData(json);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMyData();
//   }, []);

//   if (loading) return <div className="text-center mt-10">Loading your profile...</div>;
//   if (!data) return <div className="text-center mt-10 text-red-500">Failed to load data.</div>;

//   const { profile, stats, attendanceHistory, matchHistory } = data;

//   return (
//     <div className="space-y-6">

//       {/* Profile & Ready Status Banner */}
//       <div className={`p-6 rounded-lg shadow border flex justify-between items-center ${stats.isReady ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">Welcome, {profile.name}</h2>
//           <p className="text-gray-600">Age: {profile.age} | Sport: <span className="font-semibold">{profile.sport}</span></p>
//         </div>
//         <div className="text-center">
//           <p className="text-sm text-gray-500 mb-1">Academy Status</p>
//           {stats.isReady ? (
//             <span className="bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow">READY FOR SCOUTING</span>
//           ) : (
//             <span className="bg-orange-400 text-white font-bold py-2 px-4 rounded-full shadow">NOT READY YET</span>
//           )}
//         </div>
//       </div>

//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
//           <p className="text-gray-500 font-semibold mb-2">Attendance Percentage</p>
//           <p className="text-4xl font-black text-purple-700">{stats.attendancePercentage}%</p>
//           <p className="text-xs text-gray-400 mt-2">Target: 75% or higher</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
//           <p className="text-gray-500 font-semibold mb-2">Matches Played</p>
//           <p className="text-4xl font-black text-blue-700">{stats.matchesPlayed}</p>
//           <p className="text-xs text-gray-400 mt-2">Target: 2 or more</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Attendance History */}
//         <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Attendance</h3>
//           {attendanceHistory.length === 0 ? (
//              <p className="text-gray-500 text-sm">No locked sessions found.</p>
//           ) : (
//             <div className="space-y-3">
//               {attendanceHistory.map(record => (
//                 <div key={record._id} className="flex justify-between items-center text-sm border-b pb-2">
//                   <span>{new Date(record.date).toLocaleDateString()}</span>
//                   <span className={`font-bold ${record.status === 'Present' ? 'text-green-600' : 'text-red-500'}`}>
//                     {record.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Match History */}
//         <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Match Records</h3>
//           {matchHistory.length === 0 ? (
//              <p className="text-gray-500 text-sm">No matches played yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {matchHistory.map(match => (
//                 <div key={match._id} className="flex justify-between items-center text-sm border-b pb-2">
//                   <span>vs <strong>{match.opponent}</strong> ({new Date(match.date).toLocaleDateString()})</span>
//                   <span className="bg-gray-100 px-3 py-1 rounded font-bold text-gray-800 border">
//                     Score: {match.score}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// }




'use client';
import { useState, useEffect } from 'react';

export default function PlayerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar month navigation state
  const [currentDate, setCurrentDate] = useState(new Date());

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 font-bold">Loading your athletic profile...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-10 text-red-500 font-bold">Failed to load player data.</div>;

  const { profile, stats, attendanceHistory, matchHistory } = data;

  // --- CALENDAR LOGIC ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map attendance records by YYYY-MM-DD string for quick calendar lookup
  const attendanceMap = {};
  if (Array.isArray(attendanceHistory)) {
    attendanceHistory.forEach(record => {
      const dStr = new Date(record.date).toISOString().split('T')[0];
      attendanceMap[dStr] = record.status; // 'Present' or 'Absent'
    });
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Profile & Ready Status Banner (Glass Card) */}
      <div className={`p-8 rounded-3xl shadow-xl border backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${stats.isReady
          ? 'bg-gradient-to-r from-emerald-50/80 to-green-100/60 border-green-200 shadow-green-100'
          : 'bg-gradient-to-r from-orange-50/80 to-amber-100/60 border-orange-200 shadow-orange-100'
        }`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 capitalize tracking-tight">{profile.name}</h2>
            <p className="text-gray-600 font-medium text-sm mt-0.5">
              Age: <strong className="text-gray-800">{profile.age}</strong> | Sport: <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-xs ml-1">{profile.sport}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 px-6 py-3 rounded-2xl shadow-sm border border-white/60">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academy Status</p>
            <p className="font-black text-sm mt-0.5">
              {stats.isReady ? (
                <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-black">READY FOR SCOUTING 🎯</span>
              ) : (
                <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-black">NOT READY YET ⏳</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Attendance Rate</p>
          <p className="text-4xl font-black text-purple-700">{stats.attendancePercentage}%</p>
          <p className="text-xs font-semibold text-gray-400 mt-2 bg-purple-50 py-1 px-2 rounded-lg inline-block">Target: &ge; 75%</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Matches Played</p>
          <p className="text-4xl font-black text-blue-700">{stats.matchesPlayed}</p>
          <p className="text-xs font-semibold text-gray-400 mt-2 bg-blue-50 py-1 px-2 rounded-lg inline-block">Target: &ge; 2</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Present Sessions</p>
          <p className="text-4xl font-black text-emerald-600">{stats.presentSessions}</p>
          <p className="text-xs font-semibold text-gray-400 mt-2 bg-emerald-50 py-1 px-2 rounded-lg inline-block">Out of {stats.totalSessions} Total</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Score</p>
          <p className="text-4xl font-black text-amber-600">{stats.totalScore || 0}</p>
          <p className="text-xs font-semibold text-gray-400 mt-2 bg-amber-50 py-1 px-2 rounded-lg inline-block">Avg: {stats.avgScore || 0} pts</p>
        </div>
      </div>

      {/* Main Section: Visual Calendar View & Match History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* VISUAL CALENDAR ATTENDANCE GRID */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Attendance Calendar</h3>
              <div className="flex items-center gap-3 bg-white/80 px-3 py-1.5 rounded-xl border shadow-2xs">
                <button onClick={prevMonth} className="font-bold text-gray-600 hover:text-black px-1.5">&larr;</button>
                <span className="text-xs font-extrabold text-indigo-900 min-w-[90px] text-center">{monthNames[month]} {year}</span>
                <button onClick={nextMonth} className="font-bold text-gray-600 hover:text-black px-1.5">&rarr;</button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 mb-2">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty slots for previous month trailing days */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-10 rounded-xl bg-transparent"></div>
              ))}

              {/* Days of current month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const formattedMonth = String(month + 1).padStart(2, '0');
                const formattedDay = String(dayNum).padStart(2, '0');
                const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

                const status = attendanceMap[dateKey]; // 'Present', 'Absent', or undefined

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center border transition-all relative ${status === 'Present'
                        ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 shadow-2xs'
                        : status === 'Absent'
                          ? 'bg-rose-100/90 border-rose-300 text-rose-900 shadow-2xs'
                          : 'bg-white/50 border-gray-200/60 text-gray-700'
                      }`}
                  >
                    <span className="text-xs font-extrabold">{dayNum}</span>
                    {status === 'Present' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5"></span>}
                    {status === 'Absent' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-0.5"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs"></span> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs"></span> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block shadow-2xs"></span> No Session</span>
          </div>
        </div>

        {/* MATCH RECORDS CARD */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-4 border-b border-gray-200/70 pb-3">Match Records & Scores</h3>
            {!Array.isArray(matchHistory) || matchHistory.length === 0 ? (
              <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm font-medium">No matches recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {matchHistory.map(match => (
                  <div key={match._id} className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-gray-100 shadow-2xs hover:shadow transition">
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">vs {match.opponent}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(match.date).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-xl font-black text-xs">
                      {match.score} Pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs text-gray-500 flex justify-between">
            <span>Total Matches: <strong className="text-gray-800">{stats.matchesPlayed}</strong></span>
            <span>Average Performance: <strong className="text-indigo-700">{stats.avgScore || 0} / match</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
}