'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Calendar, Flame, X, Award, Sparkles } from 'lucide-react';
import {
  LeaderboardEntry,
  getMatchLeaderboard,
  getDailyPuzzleLeaderboard,
  getOverallLeaderboard,
  getUserPointsState,
  calculateStudentRank,
  maskName,
  getChessPieceForCandidate
} from '../lib/leaderboardStore';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'match' | 'daily' | 'overall';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'overall'
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'daily' | 'overall'>(defaultTab);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPoints, setUserPoints] = useState({ matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 });

  useEffect(() => {
    if (isOpen) {
      const points = getUserPointsState();
      setUserPoints(points);
      if (activeTab === 'match') {
        setLeaderboard(getMatchLeaderboard());
      } else if (activeTab === 'daily') {
        setLeaderboard(getDailyPuzzleLeaderboard());
      } else {
        setLeaderboard(getOverallLeaderboard());
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[130] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-slate-900 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Unbox Chess Champions Leaderboard
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Earn Match Points in Play Arena and Daily Puzzle Points to climb the ranks!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">Your Current Balance</div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>{userPoints.totalPoints.toLocaleString()} Total Pts</span>
                <span className="text-xs text-slate-400">
                  (<span className="text-emerald-400 font-bold">{userPoints.matchPoints} Match</span> | <span className="text-amber-400 font-bold">{userPoints.puzzlePoints} Puzzle</span>)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-black">
              <span>🏆 Rank #{calculateStudentRank(userPoints)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-black">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{userPoints.streak} Streak</span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black gap-1">
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'overall'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Overall Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('match')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'match'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Match Arena</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Puzzles</span>
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {leaderboard.map((player) => {
            const isTop5 = player.rank <= 5;
            const displayName = isTop5 ? maskName(player.name) : player.name.replace(/\s*\(You\)/gi, '');
            const pieceSvg = getChessPieceForCandidate(player.rank, player.isCurrentUser);

            return (
              <div
                key={player.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  player.isCurrentUser
                    ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-sm ${
                      player.rank === 1
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : player.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : player.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    #{player.rank}
                  </div>

                  {/* Avatar: Chess Piece for ALL candidates (User is ALWAYS White King wK.svg) */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-xs ${
                    player.isCurrentUser 
                      ? 'bg-amber-500 text-slate-950 border-2 border-amber-400' 
                      : 'bg-white border border-slate-200'
                  }`}>
                    <img
                      src={pieceSvg}
                      alt={player.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                   <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
  <span>{displayName}</span>
</div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                      <span>{player.city}</span>
                      <span>|</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> {player.streak} Streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">
                    {activeTab === 'match'
                      ? `${player.matchPoints} Match Pts`
                      : activeTab === 'daily'
                      ? `${player.puzzlePoints} Puzzle Pts`
                      : `${player.totalPoints} Total Pts`}
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">
                    {player.wins} Match Wins
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Earn Match Points to unlock Magnus Brain Hints in matches!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
