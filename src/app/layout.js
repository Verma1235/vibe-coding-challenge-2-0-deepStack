import './globals.css';
import { Toaster } from 'react-hot-toast'; 

export const metadata = {
  title: 'Academy Desk',
  description: 'Sports Academy Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* FIX: overflow-hidden ki jagah overflow-x-hidden lagaya hai taaki scrolling kaam kare */}
      <body className="min-h-screen font-sans antialiased text-gray-900 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-x-hidden">
        
        {/* Abstract background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -z-10"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 -z-10"></div>

        <Toaster position="top-right" reverseOrder={false} toastOptions={{
          className: 'backdrop-blur-md bg-white/90 border border-gray-200 shadow-xl',
          style: { backdropFilter: 'blur(10px)' }
        }} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}