'use client';
import { useRouter } from 'next/navigation';

export default function PlayerLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="relative z-10">
      {/* Floating Glass Navbar for Player Portal */}
      <nav className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 p-4 px-6 flex justify-between items-center rounded-2xl shadow-lg mb-8 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-900 dark:from-purple-400 dark:to-indigo-300">Player Portal</h1>
            <p className="text-[11px] font-semibold text-gray-100">Academy Desk Athlete Hub</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500/90 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <span>Logout</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </nav>

      {/* Main Content Render with Smooth Fade Animation */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}