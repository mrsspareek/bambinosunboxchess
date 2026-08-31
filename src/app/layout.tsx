import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { SubscriptionPaywallModal } from '../components/SubscriptionPaywallModal';

export const metadata: Metadata = {
  title: 'Bambinos - Unbox Chess iOS & Web',
  description: 'The complete chess learning and online gaming platform by Bambinos',
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
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex antialiased select-none">
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 pb-20 md:pb-8 overflow-y-auto">
            {children}
          </main>
          <MobileBottomNav />
          <SubscriptionPaywallModal />
        </AuthProvider>
      </body>
    </html>
  );
}
