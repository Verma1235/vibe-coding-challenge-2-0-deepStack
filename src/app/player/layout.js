'use client';
import { useRouter } from 'next/navigation';

export default function PlayerLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div>
      <nav className="bg-purple-800 text-white p-4 flex justify-between items-center rounded-lg shadow-md mb-6">
        <h1 className="text-xl font-bold">Player Portal</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition"
        >
          Logout
        </button>
      </nav>
      <div>{children}</div> 
    </div>
  );
}