'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Calendar, Flame, Award, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  LeaderboardEntry,
  getMatchLeaderboard,
  getDailyPuzzleLeaderboard,
  getOverallLeaderboard,
  getUserPointsState,
  calculateStudentRank,
  maskName,
  getChessPieceForCandidate
} from '../../lib/leaderboardStore';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'overall' | 'match' | 'daily'>('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPoints, setUserPoints] = useState({ matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 });

  useEffect(() => {
    const points = getUserPointsState();
    setUserPoints(points);
    if (activeTab === 'match') {
      setLeaderboard(getMatchLeaderboard());
    } else if (activeTab === 'daily') {
      setLeaderboard(getDailyPuzzleLeaderboard());
    } else {
      setLeaderboard(getOverallLeaderboard());
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/play"
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
                <Trophy className="w-6 h-6" />
              </span>
              Unbox Chess Champions Leaderboard
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Play Arena Matches & Daily Puzzles to earn points and climb the global rankings!
            </p>
          </div>
        </div>
      </div>

      {/* User Stats Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black text-xl shadow-inner">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-400">Your Current Points Balance</div>
            <div className="text-2xl font-black text-white flex items-center gap-3 mt-0.5">
              <span>{userPoints.totalPoints.toLocaleString()} Total Pts</span>
              <span className="text-xs text-slate-400 font-normal">
                (<span className="text-emerald-400 font-bold">{userPoints.matchPoints} Match Arena</span> | <span className="text-amber-400 font-bold">{userPoints.puzzlePoints} Daily Puzzles</span>)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30 text-sm font-black">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{userPoints.streak} Day Streak</span>
          </div>
          <Link
            href="/play"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20"
          >
            Play Match (+50 Pts)
          </Link>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-black gap-2">
        <button
          onClick={() => setActiveTab('overall')}
          className={`py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'overall'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 Overall Ranking</span>
        </button>

        <button
          onClick={() => setActiveTab('match')}
          className={`py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'match'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>⚔️ Match Arena Points</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'daily'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>🧩 Daily Puzzles</span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {leaderboard.map((player) => {
          const isTop5 = player.rank <= 5;
          const displayName = isTop5 ? maskName(player.name) : player.name.replace(/\s*\(You\)/gi, '');
          const pieceSvg = getChessPieceForCandidate(player.rank, player.isCurrentUser);

          return (
            <div
              key={player.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                player.isCurrentUser
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shadow-sm ${
                    player.rank === 1
                      ? 'bg-amber-500 text-slate-950'
                      : player.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : player.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{player.rank}
                </div>

                {/* Avatar: Chess Piece for ALL candidates (User is ALWAYS White King wK.svg) */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-inner ${
                  player.isCurrentUser
                    ? 'bg-amber-500 text-slate-950 border-2 border-amber-400'
                    : 'bg-slate-800/80 border border-slate-700'
                }`}>
                  <img
                    src={pieceSvg}
                    alt={player.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                 <div className="text-base font-black text-white flex items-center gap-2">
  <span>{displayName}</span>
</div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                    <span>{player.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> {player.streak} Day Streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-white">
                  {activeTab === 'match'
                    ? `${player.matchPoints} Pts`
                    : activeTab === 'daily'
                    ? `${player.puzzlePoints} Pts`
                    : `${player.totalPoints} Pts`}
                </div>
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  {player.wins} Match Wins
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint Footer */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-slate-300 text-xs font-medium flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Earn 20 Match Points to unlock Magnus Carlsen Brain Hints during live matches!
        </span>
        <Link href="/play" className="text-amber-400 font-black hover:underline">
          Go to Match Arena &rarr;
        </Link>
      </div>
    </div>
  );
}
