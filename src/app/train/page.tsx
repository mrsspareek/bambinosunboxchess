'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Target, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TrainPage() {
  const [visionScore, setVisionScore] = useState(0);
  const [targetSquare, setTargetSquare] = useState('e4');

  const squares = ['e4', 'd4', 'c4', 'f3', 'c6', 'g5', 'e5', 'a6'];

  const handleNextTarget = () => {
    setVisionScore(prev => prev + 1);
    const next = squares[Math.floor(Math.random() * squares.length)];
    setTargetSquare(next);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
          <Dumbbell className="w-9 h-9" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Tactics & Vision Training</h1>
          <p className="text-slate-500 font-medium text-sm">Targeted endgame drills, coordinate vision trainer, and pattern recognition</p>
        </div>
      </div>

      {/* Grid of Drills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Vision Board Trainer */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-black flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Coordinate Vision</h3>
              <p className="text-xs text-slate-500">Board square recognition speed drill</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase">Click Square:</span>
            <div className="text-4xl font-black text-bambinos-600">{targetSquare}</div>
            <div className="text-xs font-bold text-emerald-600">Score: {visionScore} Squares Spot</div>
          </div>

          <button
            onClick={handleNextTarget}
            className="w-full py-3 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-2xl shadow-md transition-transform active:scale-95"
          >
            Spot Target & Next
          </button>
        </div>

        {/* 2. Endgame Drills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Endgame Patterns</h3>
              <p className="text-xs text-slate-500">King & Pawn opposition mastery</p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Rook & Queen Ladder Mate</span>
              <span className="text-emerald-600 font-black">Passed ✓</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Lone King Box Shrinking</span>
              <span className="text-bambinos-600 font-black">Practice &rarr;</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Passed Pawn Escort</span>
              <span className="text-bambinos-600 font-black">Practice &rarr;</span>
            </div>
          </div>
        </div>

        {/* 3. Openings Repertoire */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Opening Repertoire</h3>
              <p className="text-xs text-slate-500">London System & Italian Game lines</p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>London Pawn Pyramid</span>
              <span className="text-emerald-600 font-black">Ready</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Scholar's Mate Defense</span>
              <span className="text-emerald-600 font-black">Ready</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Fried Liver Attack Counter</span>
              <span className="text-bambinos-600 font-black">Practice &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
