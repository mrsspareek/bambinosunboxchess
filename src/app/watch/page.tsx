'use client';

import React from 'react';
import { Tv, Radio, PlayCircle, Users, Eye } from 'lucide-react';

export default function WatchPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
            <Tv className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Bambinos Chess TV & Streams</h1>
            <p className="text-slate-500 font-medium text-sm">Watch live GM broadcasts, tournament streams, and masterclass videos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl border border-rose-200 text-xs font-black">
          <Radio className="w-4 h-4 animate-pulse" /> LIVE BROADCAST
        </div>
      </div>

      {/* Featured Stream Video Player Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="relative aspect-video rounded-2xl bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
          <div className="text-center space-y-3 p-6">
            <PlayCircle className="w-20 h-20 text-bambinos-500 mx-auto animate-pulse cursor-pointer hover:scale-110 transition-transform" />
            <h3 className="text-xl md:text-2xl font-black">Grand Championship Final: Bambinos Cup</h3>
            <p className="text-xs text-slate-400 font-medium">Live commentary by Grandmaster Trainers • 8,420 Viewers tuning in</p>
          </div>
          <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" /> 8,420 Watching
          </div>
        </div>
      </div>
    </div>
  );
}
