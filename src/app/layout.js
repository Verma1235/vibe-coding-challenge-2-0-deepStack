import './globals.css';
import { Toaster } from 'react-hot-toast'; // Naya import

export const metadata = {
  title: 'Academy Desk',
  description: 'Sports Academy Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-gray-100 text-gray-900">
        {/* Toaster component app mein kahin bhi toast dikhane ke liye */}
        <Toaster position="top-right" reverseOrder={false} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}