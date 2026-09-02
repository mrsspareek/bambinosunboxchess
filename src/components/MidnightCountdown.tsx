'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface MidnightCountdownProps {
  compact?: boolean;
}

export const MidnightCountdown: React.FC<MidnightCountdownProps> = ({ compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // 12:00 AM Midnight tonight

      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-amber-50/70 border border-amber-200 px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
          🌙
        </div>
        <div>
          <span className="font-extrabold text-slate-900 block leading-tight text-xs sm:text-sm">
            Next Puzzle Release
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            Unlocks at 12:00 AM Midnight
          </span>
        </div>
      </div>

      {/* Mini Light Theme Digital Clock Badges */}
      <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs font-black shrink-0">
        <div className="bg-white border border-amber-300 text-amber-900 px-2 py-1 rounded-xl shadow-xs text-center">
          {timeLeft.hours}<span className="text-[9px] font-sans font-bold text-slate-400 ml-0.5">h</span>
        </div>
        <span className="text-amber-500 font-black text-xs">:</span>
        <div className="bg-white border border-amber-300 text-amber-900 px-2 py-1 rounded-xl shadow-xs text-center">
          {timeLeft.minutes}<span className="text-[9px] font-sans font-bold text-slate-400 ml-0.5">m</span>
        </div>
        <span className="text-amber-500 font-black text-xs">:</span>
        <div className="bg-white border border-rose-300 text-rose-700 px-2 py-1 rounded-xl shadow-xs text-center animate-pulse">
          {timeLeft.seconds}<span className="text-[9px] font-sans font-bold text-rose-400 ml-0.5">s</span>
        </div>
      </div>
    </div>
  );
};
