import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await connectDB();
  // Sirf player role walo ko fetch karo, latest wale pehle
  const players = await User.find({ role: 'player' }).sort({ createdAt: -1 });
  return NextResponse.json(players);
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, age, sport } = await request.json();

    // Auto-generate ek username (Jaise "Amit Kumar" ban jayega "amitkumar384")
    const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    const password = 'player123'; // Default password for hackathon players

    const newPlayer = await User.create({
      name,
      age: Number(age),
      sport,
      username,
      password,
      role: 'player'
    });

    return NextResponse.json({ message: 'Player added', player: newPlayer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}