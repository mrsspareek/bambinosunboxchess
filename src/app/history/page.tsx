'use client';

import React from 'react';
import Link from 'next/link';
import { GameHistoryItem } from '../../types/chess';
import { History, Flame, Star, Play, Plus, Minus, Clock, ShieldCheck, Zap } from 'lucide-react';

const MOCK_HISTORY: GameHistoryItem[] = [
  {
    id: "g-1",
    date: "Today, 1:15 PM",
    opponent: "abdoradwan79",
    opponentRating: 935,
    opponentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    playerRating: 940,
    result: "loss",
    accuracy: 62.1,
    timeControl: "10:00",
    movesCount: 32,
    isBot: false,
    pgn: "1.e4 e5 2.Nf3 Nc6..."
  },
  {
    id: "g-2",
    date: "Today, 12:45 PM",
    opponent: "bigbadstranger",
    opponentRating: 896,
    opponentAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    playerRating: 940,
    result: "loss",
    accuracy: 58.4,
    timeControl: "10:00",
    movesCount: 28,
    isBot: false,
    pgn: "1.d4 d5 2.c4 e6..."
  },
  {
    id: "g-3",
    date: "Today, 11:30 AM",
    opponent: "Ehimhenn",
    opponentRating: 866,
    opponentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    playerRating: 932,
    result: "win",
    accuracy: 68.4,
    timeControl: "10:00",
    movesCount: 24,
    isBot: false,
    pgn: "1.e4 c5 2.Nf3 d6..."
  },
  {
    id: "g-4",
    date: "Yesterday",
    opponent: "Mo_Sylla",
    opponentRating: 879,
    opponentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    playerRating: 920,
    result: "win",
    accuracy: 74.2,
    timeControl: "10:00",
    movesCount: 40,
    isBot: false,
    pgn: "1.e4 e5 2.Bc4..."
  },
  {
    id: "g-5",
    date: "Yesterday",
    opponent: "Sudo_Nishan",
    opponentRating: 846,
    opponentAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
    playerRating: 908,
    result: "win",
    accuracy: 81.0,
    timeControl: "10:00",
    movesCount: 19,
    isBot: true,
    pgn: "1.e4 e5 2.Qh5..."
  }
];

export default function HistoryPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Matching Screenshot */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-bambinos-600 text-white font-black flex items-center justify-center text-lg shadow-md">
            ZI
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Zaid Iqbal</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" /> 4 Streak
              </span>
              <span>•</span>
              <span className="text-bambinos-600 font-extrabold">940 Rating</span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="py-3 px-6 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-2xl shadow-lg shadow-bambinos-600/30 flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" /> Play Game
        </Link>
      </div>

      {/* Game History Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 text-xs font-black text-slate-500 uppercase tracking-wider">
          <span>Game History</span>
          <span>Accuracy</span>
        </div>

        {/* List of Played Games */}
        <div className="divide-y divide-slate-100">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              {/* Left Opponent Info */}
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-bambinos-600" />

                <img src={item.opponentAvatar} alt={item.opponent} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />

                <div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {item.opponent}
                    <span className="text-xs font-bold text-slate-400">({item.opponentRating})</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{item.date}</span>
                </div>
              </div>

              {/* Right Result & Accuracy */}
              <div className="flex items-center gap-4">
                {/* Win / Loss Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-black ${
                  item.result === 'win' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {item.result === 'win' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </div>

                {/* Accuracy Percentage */}
                <span className="text-sm font-black text-slate-800 w-12 text-right">
                  {item.accuracy}%
                </span>

                {/* Game Review Star Button */}
                <button
                  onClick={() => alert(`Reviewing game PGN against ${item.opponent}...`)}
                  className="w-10 h-10 rounded-xl bg-bambinos-600 text-white flex items-center justify-center hover:bg-bambinos-700 shadow-md transition-transform active:scale-95"
                >
                  <Star className="w-5 h-5 fill-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
