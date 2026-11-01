import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Match from '@/models/Match';
import Session from '@/models/Session';

export async function GET() {
  await connectDB();
  const matches = await Match.find().populate('scores.player', 'name').sort({ date: -1 });
  return NextResponse.json(matches);
}

export async function POST(request) {
  try {
    await connectDB();
    const { date, sport, opponent, scores } = await request.json();

    // 1. Same-Day Rule Check
    const matchDate = new Date(date);
    const startOfDay = new Date(matchDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(matchDate.setUTCHours(23, 59, 59, 999));

    // Aaj ki practice session dhundho
    const todaySession = await Session.findOne({
      sport: { $regex: new RegExp(`^${sport}$`, 'i') },
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (todaySession) {
      // Har us player ko check karo jiska score hum save karne wale hain
      for (const scoreRecord of scores) {
        const playerId = scoreRecord.player;
        
        // Session mein is player ka record dhundho
        const attendanceRecord = todaySession.attendance.find(
          (att) => att.player.toString() === playerId
        );

        // Agar record mila aur wo "Absent" hai, toh strictly block kar do!
        if (attendanceRecord && attendanceRecord.status === 'Absent') {
          return NextResponse.json(
            { error: `Validation Failed: A player cannot play in the match if marked Absent in today's practice session.` },
            { status: 400 }
          );
        }
      }
    }

    // 2. Agar sab theek hai (Ya toh aaj session hi nahi tha, ya player present tha), toh Match save karo
    const newMatch = await Match.create({
      date,
      sport,
      opponent,
      scores
    });

    return NextResponse.json({ message: 'Match recorded successfully', match: newMatch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}