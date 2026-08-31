'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chessboard } from '../components/Chessboard';
import { getRandomBot, BotProfile } from '../lib/botEngine';
import { Gamepad2, Bot, Users, Trophy, Zap, ShieldCheck, Flame, PlayCircle, ArrowRight, Sparkles, Swords, Globe2, Link2, Copy, Check, UserPlus } from 'lucide-react';

export default function HomePage() {
  const [onlineCount, setOnlineCount] = useState(1420);
  const [selectedTimeControl, setSelectedTimeControl] = useState('10 min');
  const [showBotModal, setShowBotModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [demoFen, setDemoFen] = useState('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/play?room=unbox-${Math.floor(1000 + Math.random() * 9000)}` : '';

  useEffect(() => {
    const fens = [
      'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
      'r1bq1rk1/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQ - 1 5'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % fens.length;
      setDemoFen(fens[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(1, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* Left Hero Animated Board */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <Chessboard fen={demoFen} showEvalBar={true} evaluation={0.4} interactive={false} />
          <p className="text-xs font-bold text-slate-400 mt-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-bambinos-600 animate-spin" /> Live Hero Game Preview • Scholar's & Italian Opening Repertoire
          </p>
        </div>

        {/* Right Hero Call to Action Panel */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bambinos-50 border border-bambinos-200 text-bambinos-700 font-extrabold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {onlineCount.toLocaleString()} Players Online
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Play Chess Online on Bambinos #1 Site!
            </h1>
            <p className="text-slate-500 font-medium text-base">
              Join students & grandmasters worldwide. Play real-time matches, challenge friends, solve tactical puzzles, and master Unbox Chess.
            </p>
          </div>

          {/* Quick Play Time Controls */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block text-left">Select Time Control</span>
            <div className="grid grid-cols-3 gap-2">
              {['1 min', '3 min', '5 min', '10 min', '30 min', 'Custom'].map((tc) => (
                <button
                  key={tc}
                  onClick={() => setSelectedTimeControl(tc)}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs border transition-all ${
                    selectedTimeControl === tc
                      ? 'bg-bambinos-600 text-white border-bambinos-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-bambinos-300'
                  }`}
                >
                  {tc}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href="/play"
              className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <PlayCircle className="w-7 h-7" /> Play Online Now
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowFriendModal(true)}
                className="py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Play with Friend
              </button>

              <button
                onClick={() => setShowBotModal(true)}
                className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm rounded-2xl border border-slate-300 flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-bambinos-600" /> Play Computer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/play" className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-bambinos-500 transition-all shadow-sm group space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">Play with Friend</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Play local Pass & Play on same screen or send invite link to a friend.</p>
          </div>
          <div className="text-xs font-black text-amber-600 flex items-center gap-1">
            Challenge Friend &rarr;
          </div>
        </Link>

        <Link href="/puzzles" className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-bambinos-500 transition-all shadow-sm group space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-bambinos-100 text-bambinos-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-bambinos-600 transition-colors">Tactical Puzzles</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Chess.com-style puzzle studio with streak bonuses & coach prompts.</p>
          </div>
          <div className="text-xs font-black text-bambinos-600 flex items-center gap-1">
            Solve Puzzles &rarr;
          </div>
        </Link>

        <Link href="/curriculum" className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-bambinos-500 transition-all shadow-sm group space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">48-Session Curriculum</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Complete Bambinos masterplan parsed from course PDF.</p>
          </div>
          <div className="text-xs font-black text-indigo-600 flex items-center gap-1">
            Explore Syllabus &rarr;
          </div>
        </Link>
      </div>

      {/* Play with Friend Modal */}
      {showFriendModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Play with Friend</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Play on the same screen (Pass & Play) or invite a friend via link!</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/play"
                className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                🎮 Start Local Pass & Play (Same Device)
              </Link>

              <button
                onClick={handleCopyLink}
                className="w-full py-3.5 bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Invite Link Copied!' : 'Copy Play with Friend Invite Link'}
              </button>
            </div>

            <button onClick={() => setShowFriendModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Choose Bot Modal */}
      {showBotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-bambinos-600" /> Select AI Bot Opponent
              </h3>
              <button onClick={() => setShowBotModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Jimmy (Beginner)', rating: 250, style: 'Makes friendly blunders' },
                { name: 'UnboxBot_Zaid', rating: 885, style: 'Tactical Italian & Scholar setups' },
                { name: 'BambinosMaster', rating: 1200, style: 'Solid positional London System' },
                { name: 'Grandmaster AI', rating: 2200, style: 'Stockfish evaluation depth 15' }
              ].map((bot, i) => (
                <Link
                  key={i}
                  href="/play"
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-bambinos-50 border border-slate-200 hover:border-bambinos-300 flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="text-sm font-black text-slate-900 group-hover:text-bambinos-700">{bot.name}</div>
                    <div className="text-xs font-medium text-slate-500">{bot.style}</div>
                  </div>
                  <span className="px-3 py-1 bg-bambinos-600 text-white font-black text-xs rounded-xl shadow-sm">
                    {bot.rating} Elo
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
