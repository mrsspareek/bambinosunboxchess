'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, Gamepad2, Puzzle, Trophy, Lock } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { userTier, triggerPaywall } = useAuth();

  // Hide on Admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-portal') || pathname?.startsWith('/admin-login')) {
    return null;
  }

  interface NavTab {
    label: string;
    icon: any;
    href: string;
    isPremium: boolean;
    badge?: string;
  }

  const tabs: NavTab[] = [
    { label: 'Home', icon: Home, href: '/', isPremium: false },
    { label: 'Play', icon: Gamepad2, href: '/play', isPremium: false },
    { label: 'Puzzles', icon: Puzzle, href: '/puzzles', isPremium: false },
    { label: 'Ranks', icon: Trophy, href: '/leaderboard', isPremium: false }
  ];

  const handleTabClick = (e: React.MouseEvent, href: string, label: string, isPremium: boolean) => {
    if (userTier === 'free' && isPremium) {
      e.preventDefault();
      triggerPaywall(label);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          const isLocked = userTier === 'free' && tab.isPremium;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab.href, tab.label, tab.isPremium)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive ? 'text-emerald-400 font-black scale-105 bg-slate-800/80 border border-slate-700' : 'text-slate-400 font-medium hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {isLocked && (
                  <Lock className="w-3 h-3 text-amber-400 absolute -top-1 -right-2" />
                )}
                {tab.badge && !isLocked && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
