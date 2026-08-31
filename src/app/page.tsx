'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chessboard } from '../components/Chessboard';
import { getRandomBot } from '../lib/botEngine';
import { sound } from '../lib/sound';
import { Gamepad2, Bot, Users, Trophy, Zap, ShieldCheck, Flame, PlayCircle, ArrowRight, Sparkles, Swords, Globe2, Link2, Copy, Check, UserPlus, Bell, Gem, ChevronDown, Plus, X, GraduationCap } from 'lucide-react';

export default function HomePage() {
  const [onlineCount, setOnlineCount] = useState(1420);
  const [selectedTimeControl, setSelectedTimeControl] = useState('10 min');
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [showBotModal, setShowBotModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/play?room=unbox-${Math.floor(1000 + Math.random() * 9000)}` : '';

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

  const triggerSoundAndPlay = () => {
    sound.playGameStart();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 max-w-md md:max-w-4xl mx-auto space-y-6 pb-28">
      {/* Top Navigation Bar - Matching iOS Video Screen Header */}
      <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3.5 rounded-3xl border border-slate-800 shadow-lg">
        {/* Left: Avatar & League Rank Badge */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-bambinos-600 border-2 border-bambinos-400 font-black flex items-center justify-center text-xs shadow-md">
              ZI
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-slate-900" />
          </div>

          <div className="bg-bambinos-950/80 border border-bambinos-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-black text-bambinos-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4</span>
          </div>
        </div>

        {/* Center: Bambinos Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-bambinos-600 p-1 flex items-center justify-center shadow-md">
            <Image src="/logo.png" alt="Bambinos Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-black text-sm tracking-tight text-white hidden sm:inline">Bambinos</span>
        </div>

        {/* Right: Currency Counter & Bell */}
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-xl flex items-center gap-1 text-xs font-black text-sky-400 shadow-inner">
            <Gem className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span>{onlineCount.toLocaleString()}</span>
          </div>

          <button className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Puzzles Banner Card (Matching Frame 00:05 in Video) */}
      <div className="bg-gradient-to-r from-bambinos-900 via-slate-900 to-bambinos-950 border border-bambinos-500/30 p-5 rounded-3xl shadow-xl flex items-center justify-between relative overflow-hidden group">
        <div className="space-y-2 z-10">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            Featured Studio
          </span>
          <h3 className="text-xl font-black text-white">Daily Puzzles & Missions</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="text-emerald-400">250 Elo</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="w-3/4 h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        <Link
          href="/puzzles"
          className="z-10 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
        >
          Solve!
        </Link>
      </div>

      {/* Recommended Match Card (Matching Frame 00:06 in Video) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-lg space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">RECOMMENDED MATCH</span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-bambinos-800 border-2 border-bambinos-500 overflow-hidden font-black text-white flex items-center justify-center text-sm shadow-md">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">asogan1981</span>
                <span className="text-xs">🇮🇳</span>
              </div>
              <p className="text-xs font-bold text-slate-400">800 • Recent Opponent</p>
            </div>
          </div>

          <Link
            href="/play"
            onClick={triggerSoundAndPlay}
            className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Swords className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats Cards Row (Matching Frame 00:07 in Video) */}
      <div className="space-y-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">STATS</span>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-base font-black text-white">879</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Rapid</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-base font-black text-white">864</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Daily</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-base font-black text-white">790</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Blitz</div>
          </div>
        </div>
      </div>

      {/* Friends Row (Matching Frame 00:08 in Video) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FRIENDS (6)</span>
          <button onClick={() => setShowFriendModal(true)} className="text-xs font-extrabold text-bambinos-400 hover:text-bambinos-300">
            View All
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {[
            { name: 'kratiks143', status: 'Online' },
            { name: 'moooh1907', status: 'Online' },
            { name: 'shubhamy', status: 'Online' }
          ].map((friend, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 min-w-[200px] shrink-0">
              <div className="w-10 h-10 rounded-xl bg-bambinos-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                {friend.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-white truncate">{friend.name}</div>
                <div className="text-[10px] font-bold text-emerald-400">{friend.status}</div>
              </div>
              <Link
                href="/play"
                onClick={triggerSoundAndPlay}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-black border border-slate-700"
              >
                Challenge
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Big Bottom Floating Green "Play" Button (Matching Video Layout) */}
      <div className="fixed bottom-16 left-0 right-0 p-4 max-w-md md:max-w-xl mx-auto z-40">
        <button
          onClick={() => {
            sound.playMove();
            setShowPlayModal(true);
          }}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xl rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 border-emerald-300"
        >
          <PlayCircle className="w-8 h-8 fill-slate-950" /> Play
        </button>
      </div>

      {/* iOS Play Modal Bottom Sheet (Matching Frame 00:19 in Video) */}
      {showPlayModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-end justify-center">
          <div className="bg-slate-900 border-t-2 border-slate-800 rounded-t-3xl p-6 w-full max-w-md space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-emerald-400" /> Play Chess
              </h3>
              <button onClick={() => setShowPlayModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Time Control Button */}
            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-between text-sm font-black text-white">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> {selectedTimeControl}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Start Game CTA */}
            <Link
              href="/play"
              onClick={() => {
                setShowPlayModal(false);
                triggerSoundAndPlay();
              }}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Start Game
            </Link>

            {/* Action Items List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowPlayModal(false);
                  setShowFriendModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-between text-xs font-extrabold text-white"
              >
                <span className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-amber-400" /> Play a Friend (2 Players)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowPlayModal(false);
                  setShowBotModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-between text-xs font-extrabold text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-sky-400" /> Play Computer (AI Bots)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play a Friend Modal */}
      {showFriendModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-800 text-center space-y-5">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Play with Friend</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">Play Pass & Play on same screen or send invite link!</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/play"
                onClick={triggerSoundAndPlay}
                className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                🎮 Start Local Pass & Play
              </Link>

              <button
                onClick={handleCopyLink}
                className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Link Copied!' : 'Copy Play with Friend Invite Link'}
              </button>
            </div>

            <button onClick={() => setShowFriendModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Choose Bot Modal */}
      {showBotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-bambinos-400" /> Select AI Bot Opponent
              </h3>
              <button onClick={() => setShowBotModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Jimmy (Beginner)', rating: 250 },
                { name: 'UnboxBot_Zaid', rating: 885 },
                { name: 'BambinosMaster', rating: 1200 },
                { name: 'Grandmaster AI', rating: 2200 }
              ].map((bot, i) => (
                <Link
                  key={i}
                  href="/play"
                  onClick={triggerSoundAndPlay}
                  className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-all"
                >
                  <span className="text-xs font-black text-white">{bot.name}</span>
                  <span className="px-2.5 py-0.5 bg-bambinos-600 text-white font-black text-[10px] rounded-lg">
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
