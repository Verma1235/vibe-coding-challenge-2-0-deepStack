

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Match from '@/models/Match';
import Session from '@/models/Session';

export async function POST(request) {
  try {
    await connectDB();
    const { date, sport, opponent, scores } = await request.json();

    if (!date || !sport || !opponent || !Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json({ error: 'Please provide all required match details and scores.' }, { status: 400 });
    }

    // Match date ka start aur end time banayein
    const matchDate = new Date(date);
    const startOfDay = new Date(matchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(matchDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check karo ki is sport ka is date par session bana hai ya nahi
    const sessionOnDate = await Session.findOne({
      sport: { $regex: new RegExp(`^${sport.trim()}$`, 'i') },
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // CRITICAL VALIDATION: Yadi session hi nahi bana hai, ya attendance nahi li gayi
    if (!sessionOnDate) {
      return NextResponse.json(
        { error: 'Match score cannot be recorded! No practice session attendance found for this sport on this date.' },
        { status: 400 }
      );
    }

    // Count Present players in that session
    const presentPlayersCount = sessionOnDate.attendance.filter(a => a.status === 'Present').length;

    if (presentPlayersCount === 0) {
      return NextResponse.json(
        { error: 'Match score cannot be recorded! Present count is 0 for this session date.' },
        { status: 400 }
      );
    }

    // Validate ki scores mein koi aisa player toh nahi jisko session mein Absent mark kiya gaya ho
    for (const item of scores) {
      const attRecord = sessionOnDate.attendance.find(
        a => (a.player?._id || a.player).toString() === item.player.toString()
      );
      if (!attRecord || attRecord.status === 'Absent') {
        return NextResponse.json(
          { error: 'Cannot record score for a player who was absent or not present in the session on this date.' },
          { status: 400 }
        );
      }
    }

    const newMatch = new Match({
      date,
      sport: sport.trim(),
      opponent: opponent.trim(),
      scores
    });

    await newMatch.save();

    return NextResponse.json({ message: 'Match recorded successfully!', match: newMatch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const matches = await Match.find({})
      .populate('scores.player', 'name sport username')
      .sort({ date: -1 });
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}