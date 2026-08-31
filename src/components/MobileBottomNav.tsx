'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Puzzle, GraduationCap, BookOpen, Menu, Lock } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { userTier, triggerPaywall } = useAuth();

  const tabs = [
    { label: 'Home', icon: Gamepad2, href: '/', isPremium: false },
    { label: 'Puzzles', icon: Puzzle, href: '/puzzles', isPremium: true },
    { label: 'Learn', icon: GraduationCap, href: '/learn', isPremium: true },
    { label: 'Curriculum', icon: BookOpen, href: '/curriculum', isPremium: true },
    { label: 'More', icon: Menu, href: '/history', badge: 3, isPremium: false }
  ];

  const handleTabClick = (e: React.MouseEvent, href: string, label: string, isPremium: boolean) => {
    if (userTier === 'free' && isPremium) {
      e.preventDefault();
      triggerPaywall(label);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 shadow-2xl">
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
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-bambinos-600 font-black scale-105' : 'text-slate-500 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-bambinos-600' : 'text-slate-400'}`} />
                {isLocked && (
                  <Lock className="w-3 h-3 text-amber-500 absolute -top-1 -right-2" />
                )}
                {tab.badge && !isLocked && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
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
