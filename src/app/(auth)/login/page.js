// 'use client'; // Ye ek client component hai kyunki isme 'useState' aur user interaction (onClick) use hoga

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleLogin = async (e) => {
//         e.preventDefault(); // Page ko refresh hone se rokta hai
//         setLoading(true);
//         setError('');

//         try {
//             // Backend API ko call kar rahe hain
//             const res = await fetch('/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error || 'Login failed');
//                 setLoading(false);
//                 return;
//             }

//             // Login success! Role ke hisaab se redirect karo
//             if (data.role === 'coach') {
//                 router.push('/coach');
//             } else if (data.role === 'player') {
//                 router.push('/player');
//             } else if (data.role === 'scout') {
//                 router.push('/scout');
//             } else {
//                 router.push('/');
//             }

//         } catch (err) {
//             setError('Network error. Please try again.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-[80vh]">
//             <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
//                 <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Academy Desk Login</h2>

//                 {error && (
//                     <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleLogin} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                         <input
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                             disabled={loading}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                             disabled={loading}
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
//                         disabled={loading}
//                     >
//                         {loading ? 'Logging in...' : 'Login'}
//                     </button>
//                 </form>

//                 <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
//                     <p className="font-semibold mb-1">Hackathon Shortcut:</p>
//                     <p>Login with <strong>coach</strong> / <strong>coach123</strong> to auto-create the head coach account.</p>
//                 </div>
//             </div>
//         </div>
//     );
// }












// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const res = await fetch('/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error || 'Login failed');
//                 setLoading(false);
//                 return;
//             }

//             if (data.role === 'coach') router.push('/coach');
//             else if (data.role === 'player') router.push('/player');
//             else if (data.role === 'scout') router.push('/scout');
//             else router.push('/');

//         } catch (err) {
//             setError('Network error. Please try again.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-[80vh]">
//             <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-blue-200/50 dark:hover:shadow-none hover:bg-white/70 dark:hover:bg-slate-800/80">
//                 <div className="text-center mb-8">
//                     <div className="inline-block p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg mb-4">
//                         <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
//                     </div>
//                     <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-blue-400 dark:to-indigo-300">Portal Login</h2>
//                 </div>

//                 {error && (
//                     <div className="bg-red-100/90 dark:bg-red-900/40 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded-md mb-6 text-sm font-medium animate-pulse">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleLogin} className="space-y-5">
//                     <div>
//                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
//                         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading}
//                             className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100 placeholder:text-slate-400"
//                             placeholder="Enter your username"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
//                         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
//                             className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-3 rounded-xl focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100 placeholder:text-slate-400"
//                             placeholder="••••••••"
//                         />
//                     </div>

//                     <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-2">
//                         {loading && (
//                             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                         )}
//                         {loading ? 'Authenticating...' : 'Secure Login'}
//                     </button>
//                 </form>

//                 <div className="mt-8 text-xs text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
//                     <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Hackathon Credentials:</p>
//                     <p>Coach: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">coach</span> / <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">coach123</span></p>
//                     <p className="mt-1">Scout: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">scout</span> / <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">scout123</span></p>
//                 </div>
//             </div>
//         </div>
//     );
// }















'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
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

            if (data.role === 'coach') router.push('/coach');
            else if (data.role === 'player') router.push('/player');
            else if (data.role === 'scout') router.push('/scout');
            else router.push('/');

        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 transition-all duration-300 hover:shadow-blue-200/50 hover:bg-white/70">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-900">Portal Login</h2>
                </div>

                {error && (
                    <div className="bg-red-100/80 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-6 text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading}
                            className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                            className="w-full bg-white/50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 mt-2">
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="mt-8 text-xs text-gray-500 bg-white/40 p-4 rounded-xl border border-gray-200/50">
                    <p className="font-bold text-indigo-700 mb-1">Hackathon Credentials:</p>
                    <p>Coach: <span className="font-mono bg-gray-100 px-1 rounded">coach</span> / <span className="font-mono bg-gray-100 px-1 rounded">coach123</span></p>
                    <p className="mt-1">Scout: <span className="font-mono bg-gray-100 px-1 rounded">scout</span> / <span className="font-mono bg-gray-100 px-1 rounded">scout123</span></p>
                    <p className="mt-1">User: <span className="font-mono bg-gray-100 px-1 rounded">user-Id-from-dashbaord</span> / <span className="font-mono bg-gray-100 px-1 rounded">player123</span></p>

                </div>
            </div>
        </div>
    );
}