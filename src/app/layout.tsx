import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionPaywallModal } from '../components/SubscriptionPaywallModal';
import { BookDemoBanner } from '../components/BookDemoBanner';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Unbox Chess',
  description: 'Daily Chess Puzzles, 3-Level Studio, and Online Game Arena',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UnboxChess'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased overflow-x-hidden">
        <AuthProvider>
          <BookDemoBanner />
          <main className="flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
            {children}
          </main>
          <SubscriptionPaywallModal />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
