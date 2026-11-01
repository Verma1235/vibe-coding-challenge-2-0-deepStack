import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-12 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-blue-200/50 hover:bg-white/50 max-w-3xl w-full">
        <div className="mb-8 inline-block p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 mb-6 tracking-tight">
          Academy Desk
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-10 max-w-2xl mx-auto">
          Digitizing Dumka's Elite Sports Academy with <br className="hidden md:block" /> precision and style.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            <span>Enter Portal</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>

          <button className="w-full sm:w-auto px-8 py-4 bg-white/60 text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-white/80 hover:border-indigo-300 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}