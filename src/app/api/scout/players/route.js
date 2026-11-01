import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getPlayerEligibility } from '@/lib/eligibility';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Saare players nikalo
    const players = await User.find({ role: 'player' }).lean();
    const readyPlayers = [];

    // 2. Har player ka record engine se check karo
    for (const player of players) {
      const stats = await getPlayerEligibility(player._id, player.sport);
      
      // 3. BACKEND ENFORCEMENT: Agar Ready hai, tabhi array me daalo
      if (stats.isReady) {
        readyPlayers.push({
          ...player,
          stats // Hum stats bhi bhej rahe hain taaki scout dekh sake unki mehnat
        });
      }
    }

    return NextResponse.json(readyPlayers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scout data' }, { status: 500 });
  }
}