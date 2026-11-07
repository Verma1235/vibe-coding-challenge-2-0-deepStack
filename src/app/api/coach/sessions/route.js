// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Session from '@/models/Session';

// export async function GET() {
//   await connectDB();
//   const sessions = await Session.find().populate('attendance.player', 'name').sort({ date: -1 });
//   return NextResponse.json(sessions);
// }

// export async function POST(request) {
//   try {
//     await connectDB();
//     const { date, sport, attendance } = await request.json();

//     // Fix: Exact time match ki jagah pure din (24 hours) ki range check karenge
//     const sessionDate = new Date(date);
//     const startOfDay = new Date(sessionDate.setUTCHours(0, 0, 0, 0));
//     const endOfDay = new Date(sessionDate.setUTCHours(23, 59, 59, 999));

//     // DUPLICATE CHECK: Us date range me aur us sport ka session nahi hona chahiye
//     const existingSession = await Session.findOne({ 
//       sport: { $regex: new RegExp(`^${sport}$`, 'i') }, // Case-insensitive
//       date: { $gte: startOfDay, $lte: endOfDay }
//     });

//     if (existingSession) {
//       return NextResponse.json(
//         { error: `A session for ${sport} on ${date} already exists!` }, 
//         { status: 400 }
//       );
//     }

//     const newSession = await Session.create({
//       date,
//       sport,
//       attendance
//     });

//     return NextResponse.json({ message: 'Session created successfully', session: newSession }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User'; // CRITICAL: Required for .populate('attendance.player')

export async function GET() {
  try {
    await connectDB();
    const sessions = await Session.find({})
      .populate({ path: 'attendance.player', model: User, select: 'name sport username' })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(sessions || [], { status: 200 });
  } catch (error) {
    console.error('GET /api/coach/sessions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, sport, attendance } = body;

    if (!date || !sport || !Array.isArray(attendance) || attendance.length === 0) {
      return NextResponse.json(
        { error: 'Date, sport, and attendance list are required.' },
        { status: 400 }
      );
    }

    // Check duplicate session for the same sport on the same day
    const sessionDate = new Date(date);
    const startOfDay = new Date(sessionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(sessionDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingSession = await Session.findOne({
      sport: { $regex: new RegExp(`^${sport.trim()}$`, 'i') },
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingSession) {
      return NextResponse.json(
        { error: `A session for ${sport} on this date already exists!` },
        { status: 400 }
      );
    }

    const newSession = await Session.create({
      date: sessionDate,
      sport: sport.trim(),
      attendance,
      isClosed: false
    });

    // Populate player names immediately so UI can render without waiting
    const populatedSession = await Session.findById(newSession._id)
      .populate({ path: 'attendance.player', model: User, select: 'name sport username' })
      .lean();

    return NextResponse.json(
      { message: 'Session saved successfully!', session: populatedSession },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/coach/sessions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    );
  }
}