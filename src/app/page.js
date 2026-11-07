// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
//       <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-12 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 hover:bg-white/50 max-w-3xl w-full">
//         <div className="mb-8 inline-block p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
//           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
//           </svg>
//         </div>

//         <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 mb-6 tracking-tight">
//           Academy Desk
//         </h1>

//         <p className="text-xl md:text-2xl text-gray-700 font-medium mb-10 max-w-2xl mx-auto">
//           Digitizing Dumka's Elite Sports Academy with <br className="hidden md:block" /> precision and style.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
//             <span>Enter Portal</span>
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
//             </svg>
//           </Link>

//           <button className="w-full sm:w-auto px-8 py-4 bg-white/60 text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-white/80 hover:border-indigo-300 transition-all duration-300">
//             Learn More
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import Link from 'next/link';

const features = [
  {
    number: '01',
    title: 'Player Management',
    description:
      'Organize player profiles, registration details, sports categories and individual athlete information in one place.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Smart Attendance',
    description:
      'Track daily practice attendance, manage sessions and maintain accurate records with session locking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18m-13 5 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Match Analytics',
    description:
      'Record match performances, track individual scores and understand player development through performance metrics.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 5-7" />
        <path d="M16 6h4v4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Talent Scouting',
    description:
      'Identify eligible athletes through performance-based benchmarks and give scouts access to promising talent.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5M11 7v8m-4-4h8" />
      </svg>
    ),
  },
];

const roles = [
  {
    title: 'Coach',
    subtitle: 'Manage the academy',
    description: 'Register players, organize practice sessions, record attendance and manage match results.',
    icon: '⚡',
  },
  {
    title: 'Player',
    subtitle: 'Track your progress',
    description: 'View personal performance, attendance history, match records and progress analytics.',
    icon: '🏃',
  },
  {
    title: 'Scout',
    subtitle: 'Discover emerging talent',
    description: 'Explore athletes who meet the academy eligibility and performance benchmarks.',
    icon: '🎯',
  },
];

export default function Home() {
  return (
    <div className="w-full space-y-24 sm:space-y-28">

      {/* Navigation */}
      <header className="flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
              <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M3 21h18M8 21v-5h8v5M8 7h.01M16 7h.01M8 11h.01M16 11h.01" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              Academy<span className="text-blue-600">Desk</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
              Sports Management
            </p>
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg shadow-slate-900/10 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
        >
          Sign In
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-blue-200/70 shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wide">
              A Smarter Way to Manage Sports Academies
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-slate-900">
            Every Athlete.
            <br />
            Every Performance.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              One Platform.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed px-2">
            Introducing <strong className="text-slate-800">Academy Desk</strong> —
            a centralized platform designed to simplify player management,
            streamline attendance, track match performance and discover
            emerging sports talent.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">

            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300"
            >
              Access Your Portal
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 text-slate-700 font-bold shadow-sm hover:bg-white hover:-translate-y-1 transition-all duration-300"
            >
              Explore Platform
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </a>
          </div>

          <p className="mt-5 text-xs text-slate-500 font-medium">
            Secure role-based access · One centralized academy platform
          </p>
        </div>

        {/* Platform Highlight */}
        <div className="relative max-w-5xl mx-auto mt-16 sm:mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl rounded-full" />

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">

            <div className="bg-white/65 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-900/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Benchmark</span>
                <span className="text-blue-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M4 19V5m0 14h16M8 15l4-4 3 3 5-7" />
                  </svg>
                </span>
              </div>
              <p className="text-4xl font-black text-slate-900">75<span className="text-2xl text-blue-600">%</span></p>
              <p className="text-sm text-slate-500 mt-2">Minimum attendance requirement</p>
            </div>

            <div className="bg-white/65 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-900/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Match Benchmark</span>
                <span className="text-indigo-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
              </div>
              <p className="text-4xl font-black text-slate-900">02<span className="text-2xl text-indigo-600">+</span></p>
              <p className="text-sm text-slate-500 mt-2">Minimum matches played</p>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 shadow-xl shadow-indigo-900/20 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">Scouting Standard</span>
                <span className="text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-black">Performance</p>
              <p className="text-sm text-blue-100 mt-2">Eligibility-based talent discovery</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-10">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600">
            Platform Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Everything your academy needs.
            <span className="text-slate-400"> In one place.</span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            From the first player registration to performance-based talent
            discovery, manage your academy through a unified digital experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className="text-xs font-bold tracking-widest text-slate-300">
                  {feature.number}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Role-Based Access */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-600">
            Designed Around Your Role
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            One Academy. Three Experiences.
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Dedicated access and functionality for every member of the academy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl">
                {role.icon}
              </div>
              <p className="mt-6 text-xs uppercase tracking-widest text-blue-600 font-bold">
                {role.subtitle}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                {role.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-6 py-14 sm:px-12 sm:py-16 text-center shadow-2xl shadow-blue-950/20">

          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Your Academy. Digitally Connected.
            </span>

            <h2 className="mt-6 text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to take your academy forward?
            </h2>

            <p className="mt-5 text-blue-100/80 leading-relaxed text-sm sm:text-base">
              Access your personalized portal and experience a smarter
              approach to sports academy management.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 mt-8 px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold shadow-xl hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300"
            >
              Enter Academy Desk
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-300/50 pt-7 pb-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-extrabold text-slate-800">
              Academy<span className="text-blue-600">Desk</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Empowering smarter sports management.
            </p>
          </div>

          <p className="text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} Academy Desk. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
