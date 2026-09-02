'use client';

import React, { useState, useEffect } from 'react';
import { Chessboard } from '../../components/Chessboard';
import { useAuth } from '../../context/AuthContext';
import {
  getLevelPuzzles,
  getSolvedPuzzleIds,
  markPuzzleSolved,
  isPuzzleSolved,
  getPuzzleTrackerStats,
  PuzzleTrackerStats,
  LEVEL_1_PUZZLES,
  LEVEL_2_PUZZLES,
  LEVEL_3_PUZZLES
} from '../../lib/puzzleStore';
import { Puzzle, MoveAnnotation, GuidedActivity } from '../../types/chess';
import { sound } from '../../lib/sound';
import { BookDemoModal } from '../../components/BookDemoModal';
import { MidnightCountdown } from '../../components/MidnightCountdown';
import {
  Puzzle as PuzzleIcon,
  Sparkles,
  Volume2,
  HelpCircle,
  CheckCircle,
  Flame,
  ArrowRight,
  Award,
  Check,
  X,
  Target,
  Calendar,
  Layers,
  RotateCw,
  Trophy,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  RefreshCw,
  BookOpen,
  Lock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function PuzzlesPage() {
  const { userTier, triggerPaywall } = useAuth();

  const [activeTab, setActiveTab] = useState<'daily' | 1 | 2 | 3>('daily');
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(null);
  const [dailyDate, setDailyDate] = useState<string>('');
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [dailyLastSynced, setDailyLastSynced] = useState<string>('Just Now');
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Solved Tracking State
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [trackerStats, setTrackerStats] = useState<PuzzleTrackerStats>({
    totalSolved: 0,
    totalPuzzles: 15,
    level1Count: 5,
    level1Solved: 0,
    level2Count: 5,
    level2Solved: 0,
    level3Count: 5,
    level3Solved: 0,
    dailySolved: false,
    accuracy: 85,
    streak: 4,
    rating: 450
  });

  // Current Level Puzzles
  const currentLevelPuzzles = activeTab === 'daily'
    ? (dailyPuzzle ? [dailyPuzzle] : LEVEL_1_PUZZLES)
    : getLevelPuzzles(activeTab);

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle: Puzzle = currentLevelPuzzles[currentPuzzleIndex] || currentLevelPuzzles[0] || LEVEL_1_PUZZLES[0];

  // Guided Activity MCQ Mission State
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<string | null>(null);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Solving & Interaction State
  const [solved, setSolved] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [annotation, setAnnotation] = useState<MoveAnnotation | null>(null);

  // Fetch Daily Puzzle from Backend API with auto-update
  const fetchDailyPuzzle = async () => {
    try {
      setIsDailyLoading(true);
      const res = await fetch('/api/puzzles/daily');
      const data = await res.json();
      if (data.success && data.puzzle) {
        setDailyPuzzle(data.puzzle);
        setDailyDate(data.date || new Date().toISOString().split('T')[0]);
        setDailyLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch daily puzzle from backend:', e);
      setDailyPuzzle(LEVEL_3_PUZZLES[0]);
    } finally {
      setIsDailyLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyPuzzle();
    const interval = setInterval(fetchDailyPuzzle, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync Tracker Stats on mount and updates
  const refreshTracker = () => {
    const ids = getSolvedPuzzleIds();
    setSolvedIds(ids);
    setTrackerStats(getPuzzleTrackerStats());
  };

  useEffect(() => {
    refreshTracker();
  }, []);

  // Update solved status when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      setSolved(isPuzzleSolved(currentPuzzle.id));
      setAnnotation(null);
      setHintActive(false);
      setCurrentMissionIndex(0);
      setSelectedMcqAnswer(null);
      setMissionStatus('idle');
    }
  }, [currentPuzzleIndex, activeTab, currentPuzzle?.id]);

  const activeMissions: GuidedActivity[] = currentPuzzle?.activities || [];
  const currentMission: GuidedActivity | undefined = activeMissions[currentMissionIndex];

  const handlePuzzleSolvedSuccess = (puzzleId: string) => {
    setSolved(true);
    sound.playCheck();
    const { totalSolved } = markPuzzleSolved(puzzleId);
    refreshTracker();
  };

  const handleMcqSelect = (choice: string) => {
    if (!currentMission) return;

    setSelectedMcqAnswer(choice);
    if (choice === currentMission.answer) {
      setMissionStatus('correct');
      sound.playMove();
      setAnnotation({
        type: 'brilliant',
        symbol: '!!',
        label: 'Correct!',
        square: currentMission.focusSquare || 'e4'
      });

      setTimeout(() => {
        if (currentMissionIndex + 1 < activeMissions.length) {
          setCurrentMissionIndex(prev => prev + 1);
          setSelectedMcqAnswer(null);
          setMissionStatus('idle');
          setAnnotation(null);
        } else {
          handlePuzzleSolvedSuccess(currentPuzzle.id);
        }
      }, 1000);
    } else {
      setMissionStatus('wrong');
      sound.playCheck();
      setAnnotation({
        type: 'blunder',
        symbol: '??',
        label: 'Try Again',
        square: currentMission.focusSquare || 'e4'
      });
    }
  };

  const handleStandardMove = (from: string, to: string) => {
    const moveStr = `${from}${to}`;

    if (currentPuzzle.solution.includes(moveStr) || currentPuzzle.solution[0] === moveStr) {
      handlePuzzleSolvedSuccess(currentPuzzle.id);
      setAnnotation({ type: 'brilliant', symbol: '!!', label: 'Solved!', square: to });
    } else {
      sound.playCheck();
      setAnnotation({ type: 'blunder', symbol: '??', label: 'Incorrect Move', square: to });
    }
  };

  const handleNextPuzzle = () => {
    setSolved(false);
    setHintActive(false);
    setAnnotation(null);
    setCurrentMissionIndex(0);
    setSelectedMcqAnswer(null);
    setMissionStatus('idle');
    setCurrentPuzzleIndex(prev => (prev + 1) % currentLevelPuzzles.length);
  };

  const handleTabChange = (tab: 'daily' | 1 | 2 | 3) => {
    setActiveTab(tab);
    setCurrentPuzzleIndex(0);
    setSolved(false);
    setAnnotation(null);
    setHintActive(false);
    setCurrentMissionIndex(0);
    setSelectedMcqAnswer(null);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP PUZZLE TRACKER (SOLVED COUNTER, LEVEL PROGRESS, RATING) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Header & Score Cards */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Puzzle Tracker</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Track your solved puzzles across Daily and 3 difficulty levels</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-bambinos-50 border border-bambinos-200 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-bambinos-600" />
              <div>
                <div className="text-[10px] font-bold text-bambinos-700 uppercase leading-none">Total Solved</div>
                <div className="text-base font-black text-bambinos-900 leading-tight">
                  {trackerStats.totalSolved} <span className="text-xs text-slate-400 font-bold">/ {trackerStats.totalPuzzles}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div>
                <div className="text-[10px] font-bold text-amber-700 uppercase leading-none">Streak</div>
                <div className="text-base font-black text-amber-900 leading-tight">{trackerStats.streak} 🔥</div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-[10px] font-bold text-indigo-700 uppercase leading-none">Tactics Rating</div>
                <div className="text-base font-black text-indigo-900 leading-tight">{trackerStats.rating}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Breakdown Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Daily Status */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-600">
              <span className="flex items-center gap-1">🌟 Daily Puzzle</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                trackerStats.dailySolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {trackerStats.dailySolved ? 'Solved ✓' : 'Free Today'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${trackerStats.dailySolved ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-1/4'}`}
              />
            </div>
          </div>

          {/* Level 1: Beginner */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-600">
              <span className="flex items-center gap-1">🟢 Level 1</span>
              <span className="text-slate-900 text-xs font-black">
                {trackerStats.level1Solved} / {trackerStats.level1Count}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(trackerStats.level1Solved / Math.max(1, trackerStats.level1Count)) * 100}%` }}
              />
            </div>
          </div>

          {/* Level 2: Intermediate */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-600">
              <span className="flex items-center gap-1">🟡 Level 2</span>
              <span className="text-slate-900 text-xs font-black">
                {trackerStats.level2Solved} / {trackerStats.level2Count}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${(trackerStats.level2Solved / Math.max(1, trackerStats.level2Count)) * 100}%` }}
              />
            </div>
          </div>

          {/* Level 3: Advanced */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-600">
              <span className="flex items-center gap-1">🔴 Level 3</span>
              <span className="text-slate-900 text-xs font-black">
                {trackerStats.level3Solved} / {trackerStats.level3Count}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${(trackerStats.level3Solved / Math.max(1, trackerStats.level3Count)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY TABS (DAILY PUZZLE + 3 LEVELS WITH FREE/PRO ACCESS) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => handleTabChange('daily')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-102'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>🌟 Daily Puzzle</span>
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
            Free Daily
          </span>
        </button>

        <button
          onClick={() => handleTabChange(1)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 1
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>🟢 Level 1: Beginner</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
            activeTab === 1 ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {trackerStats.level1Solved}/{trackerStats.level1Count} Solved
          </span>
        </button>

        <button
          onClick={() => handleTabChange(2)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 2
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>🟡 Level 2: Intermediate</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
            activeTab === 2 ? 'bg-black/20 text-slate-950' : 'bg-amber-100 text-amber-800'
          }`}>
            {trackerStats.level2Solved}/{trackerStats.level2Count} Solved
          </span>
        </button>

        <button
          onClick={() => handleTabChange(3)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === 3
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>🔴 Level 3: Advanced</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
            activeTab === 3 ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
          }`}>
            {trackerStats.level3Solved}/{trackerStats.level3Count} Solved
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. DAILY PUZZLE ARENA (EXTRA LARGE CHESSBOARD HERO VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'daily' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {/* Left Column: Extra Large Interactive Chessboard */}
          <div className="lg:col-span-7 flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700 pb-1">
              <span className="flex items-center gap-2 font-black text-slate-900 text-base">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                {dailyPuzzle?.title || 'Daily Tactical Challenge'}
              </span>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                  {dailyPuzzle?.turn === 'w' ? 'White to Move' : 'Black to Move'}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  {dailyPuzzle?.difficulty || 'Medium'}
                </span>
              </div>
            </div>

            {/* Extra Large Chessboard for Daily Arena */}
            <div className="w-full flex justify-center py-2">
              <Chessboard
                fen={dailyPuzzle?.fen}
                onMove={handleStandardMove}
                annotation={annotation}
                interactive={!solved}
                size="xl"
                showEvalBar={true}
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Clock className="w-4 h-4 text-bambinos-600" />
              <span>Daily Puzzle for {dailyDate || 'Today'} • Auto-updated live from backend API</span>
            </div>
          </div>

          {/* Right Column: Coach Prompt, Hints & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Daily Challenge Info Banner */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px]">
                  Daily Special
                </span>
                <span className="text-amber-800 font-black text-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +1 Streak Bonus
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">{dailyPuzzle?.theme || 'Tactical Challenge'}</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {dailyPuzzle?.description || 'Find the winning tactic on the board.'}
                </p>
              </div>
            </div>

            {/* Coach Dialogue Card */}
            <div className="bg-bambinos-50 p-5 rounded-3xl border border-bambinos-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-bambinos-700">
                <Volume2 className="w-4 h-4" /> Coach Guidance
              </div>
              <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                "{dailyPuzzle?.characterPrompt || 'Look carefully at the board and spot the tactical combination!'}"
              </p>
            </div>

            {/* Hint Box */}
            {hintActive && (
              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-xs font-bold text-amber-900 flex items-start gap-2 animate-fadeIn">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black">Tactical Hint:</div>
                  <div className="mt-0.5">
                    {dailyPuzzle?.theme ? `Focus on the ${dailyPuzzle.theme}. Look for forcing moves: checks, captures, and threats!` : 'Look for the most forcing move!'}
                  </div>
                </div>
              </div>
            )}

            {/* Solved Victory Celebration */}
            {solved && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-3xl space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-600" /> Daily Puzzle Solved!
                  </div>
                  <p className="text-xs font-bold text-emerald-700">Awesome tactical vision! Added to your puzzle tracker.</p>
                  <div className="flex justify-center gap-3 text-xs font-black">
                    <span className="bg-emerald-200 text-emerald-900 px-3 py-1 rounded-xl">+50 Rating</span>
                    <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-xl">+1 Daily Streak 🔥</span>
                  </div>
                </div>

                {/* Creative Midnight 12:00 AM Countdown */}
                <MidnightCountdown />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHintActive(!hintActive)}
                  className="py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-2xl border border-amber-300 text-xs flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" /> {hintActive ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={fetchDailyPuzzle}
                  className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-300 text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" /> Check Updates
                </button>
              </div>

              {/* Book 1-on-1 Grandmaster Demo CTA */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-between text-left transition-all hover:scale-[1.02] active:scale-95 border border-amber-300/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </span>
                  <div>
                    <div className="text-xs font-black leading-tight">Master Tactics with 1-on-1 FIDE Coach</div>
                    <div className="text-[10px] font-medium text-amber-100">Free live 1-on-1 assessment for your child</div>
                  </div>
                </div>
                <span className="bg-slate-950 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow shrink-0">
                  Book Demo &rarr;
                </span>
              </button>

              <button
                onClick={() => handleTabChange(1)}
                className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2"
              >
                <span>Play Level 1 Puzzles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 4. THREE LEVEL PUZZLES STUDIO (LEVEL 1, LEVEL 2, LEVEL 3) */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Puzzle Selector List */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-bambinos-600" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Level {activeTab} Puzzles
                </span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {currentLevelPuzzles.length} Puzzles
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {currentLevelPuzzles.map((puz, idx) => {
                const isSelected = idx === currentPuzzleIndex;
                const isSolved = isPuzzleSolved(puz.id);

                return (
                  <button
                    key={puz.id}
                    onClick={() => {
                      setCurrentPuzzleIndex(idx);
                      setSolved(isSolved);
                      setAnnotation(null);
                      setHintActive(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-bambinos-600 text-white border-bambinos-600 shadow-md font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-bold hover:bg-bambinos-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isSolved
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isSolved ? '✓' : idx + 1}
                      </div>

                      <div className="truncate">
                        <div className="text-xs truncate font-extrabold">{puz.title}</div>
                        <div className={`text-[10px] font-medium truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {puz.theme}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isSolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSolved ? 'Solved' : puz.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Large Interactive Chessboard */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700">
              <span className="truncate flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {currentPuzzle?.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-bambinos-100 text-bambinos-800 font-bold text-xs shrink-0">
                {currentPuzzle?.turn === 'w' ? 'White to Move' : 'Black to Move'}
              </span>
            </div>

            <Chessboard
              fen={currentPuzzle?.fen}
              onMove={handleStandardMove}
              annotation={annotation}
              interactive={currentPuzzle?.puzzleType === 'standard' && !solved}
              size="lg"
            />
          </div>

          {/* Right Side: Coach Guidance, MCQ Missions & Actions */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-5">
            {/* Coach Prompt */}
            <div className="bg-bambinos-50 p-4 rounded-2xl border border-bambinos-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-bambinos-700 font-black">
                  <Volume2 className="w-4 h-4" /> Coach Prompt
                </span>
                <span className="bg-bambinos-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                  Level {activeTab}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 italic">
                "{currentPuzzle?.characterPrompt || currentPuzzle?.description}"
              </p>
            </div>

            {/* Guided Activity MCQ Missions */}
            {currentPuzzle?.puzzleType === 'guided_activity' && currentMission ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-black text-slate-500 border-b border-slate-200 pb-2">
                  <span className="uppercase text-bambinos-600">
                    Mission {currentMissionIndex + 1} of {activeMissions.length}
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    {currentMission.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-xs">{currentMission.question}</h4>
                  {currentMission.helper && (
                    <p className="text-[11px] font-medium text-slate-500">{currentMission.helper}</p>
                  )}
                </div>

                {/* Choices */}
                <div className="space-y-1.5">
                  {currentMission.choices?.map((choice, idx) => {
                    const isSelected = selectedMcqAnswer === choice;
                    const isCorrect = choice === currentMission.answer;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleMcqSelect(choice)}
                        className={`w-full p-2.5 rounded-xl font-extrabold text-xs text-left transition-all border flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                              : 'bg-rose-500 text-white border-rose-500 shadow-md'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-bambinos-400'
                        }`}
                      >
                        <span>{choice}</span>
                        {isSelected && (isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />)}
                      </button>
                    );
                  })}
                </div>

                {/* Hint Box */}
                {hintActive && currentMission.hint && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs font-bold text-amber-900 flex items-start gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Hint: {currentMission.hint}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-900">Tactical Objective:</p>
                <p>{currentPuzzle?.description || 'Find and play the winning move on the board.'}</p>
              </div>
            )}

            {/* Victory Card */}
            {solved && (
              <div className="bg-bambinos-50 border-2 border-bambinos-500 p-4 rounded-2xl space-y-2.5 text-center">
                <div className="flex items-center justify-center gap-2 text-bambinos-800 font-black text-sm">
                  <CheckCircle className="w-5 h-5 text-bambinos-600" /> Solved! Added to Tracker!
                </div>
                <div className="flex justify-center gap-2 text-xs font-black">
                  <span className="bg-bambinos-200 text-bambinos-900 px-2 py-0.5 rounded-lg">+40 Rating</span>
                  <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-lg">+1 Streak 🔥</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {solved ? (
                <button
                  onClick={handleNextPuzzle}
                  className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2"
                >
                  Next Puzzle <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHintActive(!hintActive)}
                    className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 text-xs flex items-center justify-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> {hintActive ? 'Hide Hint' : 'Hint'}
                  </button>
                  <button
                    onClick={handleNextPuzzle}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Demo Modal */}
      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  );
}
