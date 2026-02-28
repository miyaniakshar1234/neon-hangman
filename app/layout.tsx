import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { isFirebaseConfigured } from '@/lib/firebase';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Neon Hangman',
  description: 'A modern, fully-functional Hangman game with Firebase Auth and Firestore.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = isFirebaseConfigured ? (
    <AuthProvider>
      {children}
    </AuthProvider>
  ) : (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="glass-panel p-8 rounded-2xl max-w-md text-center border border-red-500/30">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Missing Firebase Configuration</h1>
        <p className="text-gray-300 mb-4">
          Please add your Firebase configuration to the environment variables to continue.
        </p>
        <div className="bg-black/50 p-4 rounded-lg text-left font-mono text-sm text-gray-400 overflow-x-auto">
          NEXT_PUBLIC_FIREBASE_API_KEY=...<br />
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...<br />
          NEXT_PUBLIC_FIREBASE_PROJECT_ID=...<br />
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...<br />
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...<br />
          NEXT_PUBLIC_FIREBASE_APP_ID=...
        </div>
      </div>
    </div>
  );

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-transparent text-white min-h-screen font-sans selection:bg-cyan-500/30" suppressHydrationWarning>
        <AnimatedBackground />
        {content}
      </body>
    </html>
  );
}
