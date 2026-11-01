import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';

export async function GET() {
  await connectDB();
  const sessions = await Session.find().populate('attendance.player', 'name').sort({ date: -1 });
  return NextResponse.json(sessions);
}

export async function POST(request) {
  try {
    await connectDB();
    const { date, sport, attendance } = await request.json();

    // Fix: Exact time match ki jagah pure din (24 hours) ki range check karenge
    const sessionDate = new Date(date);
    const startOfDay = new Date(sessionDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(sessionDate.setUTCHours(23, 59, 59, 999));

    // DUPLICATE CHECK: Us date range me aur us sport ka session nahi hona chahiye
    const existingSession = await Session.findOne({ 
      sport: { $regex: new RegExp(`^${sport}$`, 'i') }, // Case-insensitive
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingSession) {
      return NextResponse.json(
        { error: `A session for ${sport} on ${date} already exists!` }, 
        { status: 400 }
      );
    }

    const newSession = await Session.create({
      date,
      sport,
      attendance
    });

    return NextResponse.json({ message: 'Session created successfully', session: newSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}