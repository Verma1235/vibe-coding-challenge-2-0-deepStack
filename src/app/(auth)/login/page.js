'use client'; // Ye ek client component hai kyunki isme 'useState' aur user interaction (onClick) use hoga

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault(); // Page ko refresh hone se rokta hai
        setLoading(true);
        setError('');

        try {
            // Backend API ko call kar rahe hain
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Login success! Role ke hisaab se redirect karo
            if (data.role === 'coach') {
                router.push('/coach');
            } else if (data.role === 'player') {
                router.push('/player');
            } else if (data.role === 'scout') {
                router.push('/scout');
            } else {
                router.push('/');
            }

        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Academy Desk Login</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="font-semibold mb-1">Hackathon Shortcut:</p>
                    <p>Login with <strong>coach</strong> / <strong>coach123</strong> to auto-create the head coach account.</p>
                </div>
            </div>
        </div>
    );
}