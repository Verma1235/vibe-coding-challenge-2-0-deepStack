import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Ye route groups define karte hain ki kis role ko kahan access hai
const roleRoutes = {
  coach: '/coach',
  player: '/player',
  scout: '/scout',
};

// Public routes jahan bina login ke jaa sakte hain
const publicRoutes = ['/', '/login'];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 1. Agar route public hai aur api nahi hai, toh access allow karo
  if (publicRoutes.includes(path) && !path.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Cookie se token nikalo
  const cookie = request.cookies.get('token')?.value;
  
  // Decrypt the token
  const session = await decrypt(cookie);

  // 3. Agar user logged in NAHI hai aur protected route par jana chahta hai
  if (!session) {
    // Agar API route hit kar raha hai toh JSON error do
    if (path.startsWith('/api/')) {
      // login API ko block nahi karna hai
      if (path === '/api/auth/login') return NextResponse.next();
      
      return NextResponse.json({ error: 'Unauthorized, please login' }, { status: 401 });
    }
    // Agar page visit kar raha hai, toh login page par redirect karo
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. ROLE-BASED AUTHORIZATION LOGIC
  const userRole = session.role;

  // Agar user API hit kar raha hai toh Role check karo
  if (path.startsWith('/api/')) {
     if (path.startsWith('/api/coach') && userRole !== 'coach') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
     }
     if (path.startsWith('/api/player') && userRole !== 'player') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
     }
     if (path.startsWith('/api/scout') && userRole !== 'scout') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
     }
  } 
  // Agar user Page visit kar raha hai
  else {
    // Agar Coach '/player' ya '/scout' page par jane ki koshish kare, block and redirect
    if (path.startsWith('/player') && userRole !== 'player') {
      return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
    }
    if (path.startsWith('/coach') && userRole !== 'coach') {
      return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
    }
    if (path.startsWith('/scout') && userRole !== 'scout') {
      return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
    }
    
    // Agar logged in user galti se home (/) ya login page par aaye, toh usko uske dashboard bhej do
    if (path === '/' || path === '/login') {
       return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
    }
  }

  // Agar sab rules pass ho gaye, toh request aage badhne do
  return NextResponse.next();
}

// Ye config Next.js ko batata hai ki middleware kin routes par chalna chahiye.
// Humne static files (images, css) ko skip kar diya hai performance ke liye.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};