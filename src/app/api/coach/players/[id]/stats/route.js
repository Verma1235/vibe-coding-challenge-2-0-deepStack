// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import User from '@/models/User';
// import { getPlayerEligibility } from '@/lib/eligibility';

// export async function GET(request, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;

//     const player = await User.findById(id).select('-password');
//     if (!player) {
//       return NextResponse.json({ error: 'Player not found' }, { status: 404 });
//     }

//     // Humara pehle se bana hua central eligibility engine use kar rahe hain
//     const stats = await getPlayerEligibility(player._id, player.sport);

//     return NextResponse.json({
//       player,
//       stats
//     });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';
import Match from '@/models/Match';
import { getPlayerEligibility } from '@/lib/eligibility';

export async function GET(request, context) {
    try {
        await connectDB();
        const { id } = await context.params;

        const player = await User.findById(id).select('-password').lean();
        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        const stats = await getPlayerEligibility(player._id, player.sport);

        // Player ki session history nikalo
        const sessions = await Session.find({
            sport: { $regex: new RegExp(`^${player.sport}$`, 'i') },
            'attendance.player': player._id
        }).sort({ date: -1 }).lean();

        const attendanceHistory = sessions.map(s => {
            const rec = s.attendance.find(a => a.player.toString() === player._id.toString());
            return {
                _id: s._id,
                date: s.date,
                isClosed: s.isClosed,
                status: rec ? rec.status : 'N/A'
            };
        });

        // Player ki match history nikalo
        const matches = await Match.find({
            'scores.player': player._id
        }).sort({ date: -1 }).lean();

        const matchHistory = matches.map(m => {
            const rec = m.scores.find(s => s.player.toString() === player._id.toString());
            return {
                _id: m._id,
                date: m.date,
                opponent: m.opponent,
                score: rec ? rec.score : 0
            };
        });

        return NextResponse.json({
            player,
            stats,
            attendanceHistory,
            matchHistory
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}