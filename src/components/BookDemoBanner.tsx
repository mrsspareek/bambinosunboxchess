'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, X, Calendar, Flame } from 'lucide-react';
import { BookDemoModal } from './BookDemoModal';

export const BookDemoBanner: React.FC = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Hide on Admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-portal') || pathname?.startsWith('/admin-login')) {
    return null;
  }

  if (dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-3 py-2 sm:px-4 sm:py-2.5 shadow-md flex items-center justify-between text-xs font-black relative z-40">
        <div className="flex items-center gap-2 sm:gap-3 mx-auto flex-wrap justify-center text-center">
          <span className="flex items-center gap-1 bg-white/90 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" /> Limited Free Slots
          </span>
          <span className="text-white font-extrabold drop-shadow-sm text-xs sm:text-sm">
            🚀 Accelerate your child's chess rating with 1-on-1 coaching by Coach Zaid!
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-1 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 border border-white/20"
          >
            <span>Book Free Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/10 transition-colors ml-2"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <BookDemoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
