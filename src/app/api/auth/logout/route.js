import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token'); // Token delete kar diya
  return NextResponse.json({ message: 'Logged out successfully' });
}