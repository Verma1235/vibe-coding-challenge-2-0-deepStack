'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CoachLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const getLinkClass = (path) => {
    return pathname === path 
      ? "bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-bold" 
      : "text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md transition";
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="bg-blue-800 text-white p-4 flex justify-between items-center rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-bold">Coach Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition"
        >
          Logout
        </button>
      </nav>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        <Link href="/coach" className={getLinkClass('/coach')}>Manage Players</Link>
        <Link href="/coach/sessions" className={getLinkClass('/coach/sessions')}>Practice Sessions</Link>
        {/* Matches ka tab hum aage banayenge, par link abhi daal dete hain */}
        <Link href="/coach/matches" className={getLinkClass('/coach/matches')}>Manage Matches</Link>
      </div>

      {/* Main Content */}
      <div>{children}</div> 
    </div>
  );
}