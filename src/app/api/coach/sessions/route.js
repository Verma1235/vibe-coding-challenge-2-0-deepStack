import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';

export async function GET() {
  await connectDB();
  // .populate() se hum player ki id ke sath uska 'name' bhi le aate hain taaki display karne me asani ho
  const sessions = await Session.find().populate('attendance.player', 'name').sort({ date: -1 });
  return NextResponse.json(sessions);
}

export async function POST(request) {
  try {
    await connectDB();
    const { date, sport, attendance } = await request.json();

    const newSession = await Session.create({
      date,
      sport,
      attendance
    });

    return NextResponse.json({ message: 'Session created successfully', session: newSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}