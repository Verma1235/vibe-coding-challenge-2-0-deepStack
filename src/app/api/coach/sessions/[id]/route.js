// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Session from '@/models/Session';

// export async function PATCH(request, context) {
//   try {
//     await connectDB();

//     // Params read karne ka safe tarika
//     const { id } = await context.params;

//     const session = await Session.findById(id);

//     if (!session) {
//       return NextResponse.json({ error: 'Session not found' }, { status: 404 });
//     }

//     if (session.isClosed) {
//       return NextResponse.json({ error: 'Session is already locked' }, { status: 400 });
//     }

//     session.isClosed = true;
//     await session.save();

//     return NextResponse.json({ message: 'Session locked successfully' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';

// EXISTING: Lock Session
export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const session = await Session.findById(id);

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (session.isClosed) return NextResponse.json({ error: 'Session is already locked' }, { status: 400 });

    session.isClosed = true;
    await session.save();

    return NextResponse.json({ message: 'Session locked successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// NEW: Update Attendance (Only if NOT locked)
export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { attendance } = await request.json();

    const session = await Session.findById(id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Strict Business Rule: Block edits if session is locked
    if (session.isClosed) {
      return NextResponse.json({ error: 'Cannot edit! This session is locked.' }, { status: 403 });
    }

    session.attendance = attendance;
    await session.save();

    return NextResponse.json({ message: 'Attendance updated successfully', session });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}