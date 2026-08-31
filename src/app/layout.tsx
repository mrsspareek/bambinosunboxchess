import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { SubscriptionPaywallModal } from '../components/SubscriptionPaywallModal';

export const metadata: Metadata = {
  title: 'Bambinos - Unbox Chess',
  description: 'The complete chess learning and online gaming platform by Bambinos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex antialiased">
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
