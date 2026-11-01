import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    // --- DEVELOPER SHORTCUT FOR HACKATHON ---
    const userCount = await User.countDocuments();
    if (userCount === 0 && username === 'coach' && password === 'coach123') {
      await User.create({ name: 'Head Coach', username: 'coach', password: 'coach123', role: 'coach' });
    }
    // Agar scout likhe toh usko auto-create kar do testing ke liye
    if (username === 'scout' && password === 'scout123') {
      const scoutExists = await User.findOne({ username: 'scout' });
      if (!scoutExists) {
        await User.create({ name: 'Talent Scout', username: 'scout', password: 'scout123', role: 'scout' });
      }
    }
    // ----------------------------------------

    // 1. Find User in DB
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Match Password (Hackathon ke liye hum direct string match kar rahe hain)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Create Token Payload (Token ke andar ka data)
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      username: user.username
    };

    // 4. Generate Encrypted JWT
    const token = await encrypt(payload);

    // 5. Set HTTP-Only Cookie (Browser is cookie ko chura nahi sakta)
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Success Response
    return NextResponse.json({
      message: 'Login successful',
      role: user.role
    }, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}