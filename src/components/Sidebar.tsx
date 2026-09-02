'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Puzzle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { BookDemoModal } from './BookDemoModal';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userTier, setUserTier, triggerPaywall } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Hide Student Sidebar completely on Admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-portal') || pathname?.startsWith('/admin-login')) {
    return null;
  }

  const navItems = [
    { label: 'Play', icon: Gamepad2, href: '/', badge: '1,420 Live', isPremium: false },
    { label: 'Puzzles', icon: Puzzle, href: '/puzzles', badge: 'Daily + 3 Lvls', isPremium: false },
    { label: 'Leaderboard', icon: Trophy, href: '/leaderboard', badge: 'Top Ranks', isPremium: false }
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, label: string, isPremium: boolean) => {
    if (userTier === 'free' && isPremium) {
      e.preventDefault();
      triggerPaywall(label);
    }
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-sm z-30">
        {/* Brand Header with Clean Logo (Blue Background Removed) */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <Image 
              src="/logo2.png" 
              alt="Bambinos Logo" 
              width={44} 
              height={44} 
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 tracking-tight leading-none">Unbox Chess</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isLocked = userTier === 'free' && item.isPremium;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.label, item.isPremium)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-bambinos-600 text-white shadow-lg shadow-bambinos-600/30 translate-x-1'
                    : 'text-slate-600 hover:bg-bambinos-50 hover:text-bambinos-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {isLocked && (
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-bambinos-100 text-bambinos-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* HIGH CONVERTING BOOK DEMO SIDEBAR CARD */}
          <div className="pt-4">
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-4 rounded-2xl text-white shadow-xl shadow-amber-500/20 space-y-2.5 relative overflow-hidden border border-amber-400/40">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-100">
                <Sparkles className="w-3 h-3 text-amber-200 animate-spin" /> Free Live Demo
              </div>
              <div>
                <h4 className="font-black text-sm text-white leading-tight">Master Unbox Chess</h4>
                <p className="text-[11px] font-medium text-amber-100 mt-0.5 leading-snug">
                  1-on-1 Grandmaster coaching session for your child.
                </p>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-white/20"
              >
                <span>Book Free Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </nav>

        {/* Student Tier Toggle & Profile Footer */}
        <div className="p-3 m-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bambinos-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                ZI
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 leading-none">Zaid Iqbal</p>
                <span className="text-[10px] font-extrabold text-emerald-600">✓ Full Access Student</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  );
};
