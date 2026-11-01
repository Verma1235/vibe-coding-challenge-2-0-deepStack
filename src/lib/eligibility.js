// import connectDB from '@/lib/db';
// import Session from '@/models/Session';
// import Match from '@/models/Match';

// export async function getPlayerEligibility(playerId, sport) {
//   await connectDB();

//   // 1. Total CLOSED sessions for this sport
//   // Hum sirf locked sessions ginte hain taaki attendance percentage fix rahe
//   const totalSessions = await Session.countDocuments({ 
//     sport: { $regex: new RegExp(`^${sport}$`, 'i') }, 
//     isClosed: true 
//   });

//   // 2. Total CLOSED sessions jahan ye player PRESENT tha
//   const presentSessions = await Session.countDocuments({
//     sport: { $regex: new RegExp(`^${sport}$`, 'i') },
//     isClosed: true,
//     'attendance': {
//       $elemMatch: { player: playerId, status: 'Present' }
//     }
//   });

//   // 3. Total Matches jisme is player ne khela (score receive kiya)
//   const matchesPlayed = await Match.countDocuments({
//     'scores.player': playerId
//   });

//   // 4. Calculate Percentage (Divide by zero se bachne ke liye condition)
//   let attendancePercentage = 0;
//   if (totalSessions > 0) {
//     attendancePercentage = (presentSessions / totalSessions) * 100;
//   }

//   // Percentage ko round off kar rahe hain (e.g., 74.5 becomes 75)
//   const finalPercentage = Math.round(attendancePercentage);

//   // 5. Strict Business Rules
//   const isReady = finalPercentage >= 75 && matchesPlayed >= 2;

//   return {
//     totalSessions,
//     presentSessions,
//     attendancePercentage: finalPercentage,
//     matchesPlayed,
//     isReady
//   };
// }


import connectDB from '@/lib/db';
import Session from '@/models/Session';
import Match from '@/models/Match';

export async function getPlayerEligibility(playerId, sport) {
  await connectDB();

  // FIX: Count ONLY closed sessions where this player was actually enrolled/marked
  const totalSessions = await Session.countDocuments({
    sport: { $regex: new RegExp(`^${sport}$`, 'i') },
    isClosed: true,
    'attendance.player': playerId
  });

  // Total CLOSED sessions where this player was PRESENT
  const presentSessions = await Session.countDocuments({
    sport: { $regex: new RegExp(`^${sport}$`, 'i') },
    isClosed: true,
    attendance: {
      $elemMatch: { player: playerId, status: 'Present' }
    }
  });

  const absentSessions = totalSessions - presentSessions;

  // Fetch matches where this player participated to calculate count & scores
  const playerMatches = await Match.find({
    'scores.player': playerId
  }).lean();

  const matchesPlayed = playerMatches.length;

  let totalScore = 0;
  playerMatches.forEach(m => {
    const record = m.scores.find(s => s.player.toString() === playerId.toString());
    if (record) totalScore += Number(record.score || 0);
  });

  const avgScore = matchesPlayed > 0 ? Number((totalScore / matchesPlayed).toFixed(1)) : 0;

  // Calculate Percentage safely
  let attendancePercentage = 0;
  if (totalSessions > 0) {
    attendancePercentage = (presentSessions / totalSessions) * 100;
  }

  const finalPercentage = Math.round(attendancePercentage);

  // Strict Business Rules: >= 75% Attendance AND >= 2 Matches
  const isReady = finalPercentage >= 75 && matchesPlayed >= 2;

  return {
    totalSessions,
    presentSessions,
    absentSessions,
    attendancePercentage: finalPercentage,
    matchesPlayed,
    totalScore,
    avgScore,
    isReady
  };
}