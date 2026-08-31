'use client';

import React from 'react';
import { Users, Trophy, MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
          <Users className="w-9 h-9" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Bambinos Chess Community</h1>
          <p className="text-slate-500 font-medium text-sm">Clubs, student forums, tournaments, and friend leaderboards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clubs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-bambinos-600" /> Featured Chess Clubs
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Unbox Chess Champions Club', members: '1,240 Members', status: 'Official' },
              { name: 'Bambinos Tactics Masters', members: '820 Members', status: 'Active' },
              { name: 'Junior Grandmaster League', members: '450 Members', status: 'Tournament' }
            ].map((club, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{club.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{club.members}</div>
                </div>
                <button className="px-4 py-2 bg-bambinos-600 text-white font-bold text-xs rounded-xl shadow-sm">
                  Join Club
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Student Forums */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-bambinos-600" /> Discussion Forums
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Best opening defense against Scholar’s Mate?', replies: '24 Replies', tag: 'Opening' },
              { title: 'How to avoid stalemate in King + Queen endgame?', replies: '18 Replies', tag: 'Endgame' },
              { title: 'Session 19 Knight Fork puzzle walkthrough', replies: '32 Replies', tag: 'Puzzles' }
            ].map((topic, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-extrabold text-sm text-slate-900 hover:text-bambinos-600 cursor-pointer">{topic.title}</div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{topic.replies}</span>
                  <span className="bg-bambinos-100 text-bambinos-700 px-2 py-0.5 rounded-md font-bold text-[10px]">{topic.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
