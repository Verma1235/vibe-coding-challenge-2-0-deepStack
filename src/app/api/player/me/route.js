import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';
import Match from '@/models/Match';
import { decrypt } from '@/lib/auth';
import { getPlayerEligibility } from '@/lib/eligibility';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Cookie se token nikal kar user ki ID pata karo (100% secure, frontend se ID nahi le rahe)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const sessionToken = await decrypt(token);

    if (!sessionToken || sessionToken.role !== 'player') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionToken.userId;

    // 2. Fetch Profile
    const profile = await User.findById(userId).select('-password'); // Password frontend par kabhi nahi bhejna chahiye

    // 3. Fetch Eligibility Stats (using our central engine)
    const stats = await getPlayerEligibility(userId, profile.sport);

    // 4. Fetch Attendance History (Sirf closed sessions jisme ye player tha)
    const sessions = await Session.find({
      sport: { $regex: new RegExp(`^${profile.sport}$`, 'i') },
      isClosed: true,
      'attendance.player': userId
    }).sort({ date: -1 });

    // Format attendance so it's easy for frontend
    const attendanceHistory = sessions.map(session => {
      const myRecord = session.attendance.find(a => a.player.toString() === userId);
      return {
        _id: session._id,
        date: session.date,
        status: myRecord ? myRecord.status : 'Unknown'
      };
    });

    // 5. Fetch Match Records (Sirf wo matches jisme isne score kiya/khela)
    const matches = await Match.find({ 'scores.player': userId }).sort({ date: -1 });
    const matchHistory = matches.map(match => {
      const myScore = match.scores.find(s => s.player.toString() === userId);
      return {
        _id: match._id,
        date: match.date,
        opponent: match.opponent,
        score: myScore ? myScore.score : 0
      };
    });

    // 6. Send perfectly isolated data
    return NextResponse.json({
      profile,
      stats,
      attendanceHistory,
      matchHistory
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 });
  }
}