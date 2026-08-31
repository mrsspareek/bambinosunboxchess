'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Puzzle, GraduationCap, BookOpen, Dumbbell, Tv, Users, History, Lock, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userTier, setUserTier, triggerPaywall } = useAuth();

  const navItems = [
    { label: 'Play', icon: Gamepad2, href: '/', badge: '1,420 Live', isPremium: false },
    { label: 'Puzzles', icon: Puzzle, href: '/puzzles', isPremium: true },
    { label: 'Learn', icon: GraduationCap, href: '/learn', isPremium: true },
    { label: 'Curriculum', icon: BookOpen, href: '/curriculum', badge: '48 Sessions', isPremium: true },
    { label: 'Train', icon: Dumbbell, href: '/train', isPremium: true },
    { label: 'Watch TV', icon: Tv, href: '/watch', isPremium: false },
    { label: 'Community', icon: Users, href: '/community', isPremium: false },
    { label: 'Game History', icon: History, href: '/history', isPremium: false }
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, label: string, isPremium: boolean) => {
    if (userTier === 'free' && isPremium) {
      e.preventDefault();
      triggerPaywall(label);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-sm z-30">
      {/* Brand Header with Bambinos Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md bg-bambinos-600 p-1 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Bambinos Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">Bambinos</h1>
          <span className="text-xs font-bold text-bambinos-600 tracking-wider uppercase">Unbox Chess</span>
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
      </nav>

      {/* Student Tier Toggle & Profile Footer */}
      <div className="p-3 m-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bambinos-600 text-white font-black flex items-center justify-center text-xs shadow-md">
              ZI
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 leading-none">Zaid Iqbal</p>
              <span className="text-[10px] font-bold text-slate-400">Student Account</span>
            </div>
          </div>
        </div>

        {/* Account Status Switcher Toggle (Free vs Subscribed) */}
        <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-500">Tier:</span>
          <button
            onClick={() => setUserTier(userTier === 'free' ? 'subscribed' : 'free')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
              userTier === 'subscribed'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {userTier === 'subscribed' ? '✓ Subscribed Student' : '🔒 Free Player (Click to Upgrade)'}
          </button>
        </div>
      </div>
    </aside>
  );
};
