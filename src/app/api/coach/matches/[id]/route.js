import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Match from '@/models/Match';
import Session from '@/models/Session';

async function extractMatchId(request, context) {
  const resolvedParams = await Promise.resolve(context?.params);
  let id = resolvedParams?.id;
  if (!id) {
    const segments = new URL(request.url).pathname.split('/').filter(Boolean);
    id = segments[segments.length - 1];
  }
  return id;
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const id = await extractMatchId(request, context);
    if (!id) return NextResponse.json({ error: 'Match ID missing' }, { status: 400 });

    const { opponent, scores } = await request.json();

    if (!Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json({ error: 'Please provide valid scores for at least one player' }, { status: 400 });
    }

    const match = await Match.findById(id);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Verify against session attendance on that match date (if session exists)
    const matchDate = new Date(match.date);
    const startOfDay = new Date(matchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(matchDate.setHours(23, 59, 59, 999));

    const sessionOnDate = await Session.findOne({
      sport: { $regex: new RegExp(`^${match.sport}$`, 'i') },
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (sessionOnDate) {
      for (const item of scores) {
        const attRecord = sessionOnDate.attendance.find(
          a => a.player.toString() === item.player.toString()
        );
        if (attRecord && attRecord.status === 'Absent') {
          return NextResponse.json(
            { error: 'Cannot assign score to a player marked Absent on this date.' },
            { status: 400 }
          );
        }
      }
    }

    if (opponent && opponent.trim() !== '') {
      match.opponent = opponent.trim();
    }
    match.scores = scores;
    await match.save();

    return NextResponse.json({ message: 'Match scores updated successfully!', match });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}