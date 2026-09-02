'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Chessboard } from '../components/Chessboard';
import { useAuth } from '../context/AuthContext';
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
} from '../lib/puzzleStore';
import { Puzzle, MoveAnnotation, GuidedActivity, GameHistoryItem } from '../types/chess';
import { sound } from '../lib/sound';
import { FreeSignUpModal, StudentUserData } from '../components/FreeSignUpModal';
import { BookDemoModal } from '../components/BookDemoModal';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { getUserPointsState, UserPointsState } from '../lib/leaderboardStore';
import { MidnightCountdown } from '../components/MidnightCountdown';
import {
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
  Gamepad2,
  Bot,
  UserPlus,
  Copy,
  History,
  TrendingUp,
  Plus,
  Minus,
  Lock,
  ChevronDown,
  ArrowDown,
  User,
  MapPin,
  Phone,
  GraduationCap,
  LogOut,
  Swords,
  Brain,
  Info
} from 'lucide-react';

const INITIAL_MOCK_HISTORY: GameHistoryItem[] = [
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
  }
];

export default function SinglePageStudentPortal() {
  const { userTier, setUserTier, triggerPaywall } = useAuth();

  // Free Sign-up & Subscribed Login Gate State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<StudentUserData | null>(null);

  // Demo Booking Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Animated Small Chessboard for Play Arena Hero
  const [animatedHeroFen, setAnimatedHeroFen] = useState('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');

  // Play Game Arena & Leaderboard State
  const [onlineCount, setOnlineCount] = useState(1420);
  const [selectedTimeControl, setSelectedTimeControl] = useState('10 min');
  const [showBotModal, setShowBotModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [userPoints, setUserPoints] = useState<UserPointsState>({ matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 });
  const [copiedLink, setCopiedLink] = useState(false);
  const [gameHistoryList, setGameHistoryList] = useState<GameHistoryItem[]>(INITIAL_MOCK_HISTORY);
  const [showRewardInfoModal, setShowRewardInfoModal] = useState(false);

  useEffect(() => {
    setUserPoints(getUserPointsState());
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowRewardInfoModal(false);
    };
    if (showRewardInfoModal) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showRewardInfoModal]);

  // Daily Tactical Puzzle State (Large Board)
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(null);
  const [dailyDate, setDailyDate] = useState<string>('');
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [dailySolved, setDailySolved] = useState(false);
  const [dailyHintActive, setDailyHintActive] = useState(false);
  const [dailyAnnotation, setDailyAnnotation] = useState<MoveAnnotation | null>(null);

  // Extra Practice Puzzles State
  const [practiceTab, setPracticeTab] = useState<1 | 2 | 3>(1);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceSolved, setPracticeSolved] = useState(false);
  const [practiceHintActive, setPracticeHintActive] = useState(false);
  const [practiceAnnotation, setPracticeAnnotation] = useState<MoveAnnotation | null>(null);
  const [practiceMissionIndex, setPracticeMissionIndex] = useState(0);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<string | null>(null);

  // Solved Tracker Stats
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

  // Check LocalStorage Auth on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('unbox_student_user');
      if (stored) {
        const parsed: StudentUserData = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.isSubscribed) {
          setUserTier('subscribed');
        }
      } else {
        setShowAuthModal(true);
      }
    } catch (e) {
      setShowAuthModal(true);
    }
  }, [setUserTier]);

  // Animated Play Hero Chessboard Moves Loop
  useEffect(() => {
    const fens = [
      'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4',
      'r1bq1rk1/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQ - 1 5',
      'r1bq1rk1/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQ - 0 6'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % fens.length;
      setAnimatedHeroFen(fens[idx]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Fetch Daily Puzzle from API
  const fetchDailyPuzzle = async () => {
    try {
      setIsDailyLoading(true);
      const res = await fetch('/api/puzzles/daily');
      const data = await res.json();
      if (data.success && data.puzzle) {
        setDailyPuzzle(data.puzzle);
        setDailyDate(data.date || new Date().toISOString().split('T')[0]);
        setDailySolved(isPuzzleSolved(data.puzzle.id));
      }
    } catch (e) {
      setDailyPuzzle(LEVEL_1_PUZZLES[0]);
    } finally {
      setIsDailyLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyPuzzle();
    const interval = setInterval(fetchDailyPuzzle, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync Tracker
  const refreshTracker = () => {
    setTrackerStats(getPuzzleTrackerStats());
  };

  useEffect(() => {
    refreshTracker();
  }, []);

  // Current Practice Puzzle
  const currentPracticePuzzles = getLevelPuzzles(practiceTab);
  const activePracticePuzzle: Puzzle = currentPracticePuzzles[practiceIndex] || currentPracticePuzzles[0] || LEVEL_1_PUZZLES[0];

  useEffect(() => {
    if (activePracticePuzzle) {
      setPracticeSolved(isPuzzleSolved(activePracticePuzzle.id));
      setPracticeAnnotation(null);
      setPracticeHintActive(false);
      setPracticeMissionIndex(0);
      setSelectedMcqAnswer(null);
    }
  }, [practiceIndex, practiceTab, activePracticePuzzle?.id]);

  // Handle Daily Move
  const handleDailyMove = (from: string, to: string) => {
    if (!dailyPuzzle) return;
    const moveStr = `${from}${to}`;
    if (dailyPuzzle.solution.includes(moveStr) || dailyPuzzle.solution[0] === moveStr) {
      setDailySolved(true);
      sound.playCheck();
      markPuzzleSolved(dailyPuzzle.id);
      setDailyAnnotation({ type: 'brilliant', symbol: '!!', label: 'Solved!', square: to });
      refreshTracker();
    } else {
      sound.playCheck();
      setDailyAnnotation({ type: 'blunder', symbol: '??', label: 'Try Again', square: to });
    }
  };

  // Handle Practice Move
  const handlePracticeMove = (from: string, to: string) => {
    const moveStr = `${from}${to}`;
    if (activePracticePuzzle.solution.includes(moveStr) || activePracticePuzzle.solution[0] === moveStr) {
      setPracticeSolved(true);
      sound.playCheck();
      markPuzzleSolved(activePracticePuzzle.id);
      setPracticeAnnotation({ type: 'brilliant', symbol: '!!', label: 'Solved!', square: to });
      refreshTracker();
    } else {
      sound.playCheck();
      setPracticeAnnotation({ type: 'blunder', symbol: '??', label: 'Try Again', square: to });
    }
  };

  const handlePracticeTabChange = (tab: 1 | 2 | 3) => {
    if (userTier === 'free' && (tab === 2 || tab === 3)) {
      triggerPaywall(tab === 2 ? 'Level 2: Intermediate Tactics' : 'Level 3: Advanced Tactics');
      return;
    }
    setPracticeTab(tab);
    setPracticeIndex(0);
  };

  const activeMissions: GuidedActivity[] = activePracticePuzzle?.activities || [];
  const currentMission: GuidedActivity | undefined = activeMissions[practiceMissionIndex];

  const handleMcqSelect = (choice: string) => {
    if (!currentMission) return;
    setSelectedMcqAnswer(choice);
    if (choice === currentMission.answer) {
      sound.playMove();
      setPracticeAnnotation({ type: 'brilliant', symbol: '!!', label: 'Correct!', square: currentMission.focusSquare || 'e4' });
      setTimeout(() => {
        if (practiceMissionIndex + 1 < activeMissions.length) {
          setPracticeMissionIndex(prev => prev + 1);
          setSelectedMcqAnswer(null);
          setPracticeAnnotation(null);
        } else {
          setPracticeSolved(true);
          sound.playCheck();
          markPuzzleSolved(activePracticePuzzle.id);
          refreshTracker();
        }
      }, 900);
    } else {
      sound.playCheck();
      setPracticeAnnotation({ type: 'blunder', symbol: '??', label: 'Incorrect', square: currentMission.focusSquare || 'e4' });
    }
  };

  const totalGamesPlayed = gameHistoryList.length + 19;
  const winsCount = gameHistoryList.filter(g => g.result === 'win').length + 13;
  const lossesCount = gameHistoryList.filter(g => g.result === 'loss').length + 5;
  const drawsCount = Math.max(0, totalGamesPlayed - winsCount - lossesCount);
  const winRatePercentage = Math.round((winsCount / Math.max(1, totalGamesPlayed)) * 100);

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/?room=unbox-${Math.floor(1000 + Math.random() * 9000)}#play-arena` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('unbox_student_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setUserTier('free');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* ========================================================================= */}
      {/* TOP NAVBAR (NO SIDEBAR - CLEAN BRAND & SHORTCUT JUMP LINKS) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 md:px-8 py-3.5">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image 
                src="./logo2.png" 
                alt="Bambinos Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight leading-none">Unbox Chess</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Play Arena • Daily Puzzle • Practice</span>
            </div>
          </div>

          {/* Navigation Jump Shortcuts */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black">
            <a
              href="#play-arena"
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 shadow-sm flex items-center gap-1.5"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-bambinos-600" />
              <span>1. Play Arena</span>
            </a>
            <a
              href="#daily-puzzle"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Daily Puzzle</span>
            </a>
            <a
              href="#practice-puzzles"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Extra Practice Puzzles</span>
            </a>
          </div>

          {/* Right Header Actions: User Badge, Logout & Book Demo Button */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
                    userTier === 'subscribed' ? 'bg-emerald-600' : 'bg-bambinos-600'
                  }`}>
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-extrabold text-slate-900 leading-none">{currentUser.name}</div>
                    <span className={`text-[10px] font-black ${userTier === 'subscribed' ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {userTier === 'subscribed' ? '★ Subscribed Student' : 'Free Tier Player'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log Out of Account"
                  className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-500 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline text-rose-600">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black border border-slate-200"
              >
                Log In / Sign Up
              </button>
            )}

            <button
              onClick={() => setShowDemoModal(true)}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
              <span>Book Free Demo</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-6 space-y-16 overflow-x-hidden">
        {/* ========================================================================= */}
        {/* 1. PLAY ARENA (PLACED AT THE TOP - SMALL ANIMATED CHESSBOARD) */}
        {/* ========================================================================= */}
        <section id="play-arena" className="space-y-6 pt-2">
          {/* Top Left Stats & History Header Bar (Vibrant & Colorful Theme) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-50/50 to-indigo-50/50 p-4 sm:p-5 rounded-3xl border-2 border-amber-300/80 shadow-lg shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            {/* Ambient Background Radial Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Top-Left Stat of Games Played */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto relative z-10">
              {/* Vibrant 3D Trophy Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-orange-500/30 border border-amber-300/50">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">Games Played</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1">
                    🔥 {winRatePercentage}% Win Rate
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xl font-black text-slate-900 tracking-tight">{totalGamesPlayed} Games</span>
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
                      🟢 {winsCount}W
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
                      🔴 {lossesCount}L
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 border border-slate-300 shadow-xs">
                      ⚪ {drawsCount}D
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Book Demo (Desktop Only) & Game History */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto relative z-10">
              <button
                onClick={() => setShowDemoModal(true)}
                className="hidden md:flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 text-white animate-spin" />
                <span>Book Free Demo</span>
              </button>

              <button
                onClick={() => setShowHistoryModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black border border-slate-700 shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>Game History</span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {gameHistoryList.length}
                </span>
              </button>
            </div>
          </div>

          {/* Play Arena Hero with Perfectly Proportioned Live Board (Aligned with lower section) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {/* Left Column: Board Container (lg:col-span-7 matching lower section) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 w-full">
              {/* Chessboard fitting cleanly in card */}
              <Chessboard
                fen={animatedHeroFen}
                size="xl"
                showEvalBar={true}
                evaluation={0.4}
                interactive={false}
              />

              <p className="text-[11px] font-bold text-slate-400 mt-2 text-center">
                Italian Game & Scholar's Attack Repertoire
              </p>
            </div>

            {/* Right Column: Divided into 2 Distinct Parts (lg:col-span-5 matching lower section) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              {/* Main Headline */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bambinos-50 border border-bambinos-200 text-bambinos-700 font-extrabold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {onlineCount.toLocaleString()} Players Online Now
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome to Unbox Chess, <span className="text-amber-500">{currentUser ? currentUser.name.split(' ')[0] : 'Zaid'}</span>
                </h2>
              </div>

              {/* ========================================================================= */}
              {/* PART 1: 🏆 CHESS LEADERBOARD POINTS & DAILY PUZZLE RANKINGS */}
              {/* ========================================================================= */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/40 to-indigo-50/40 p-4 rounded-2xl border border-amber-300/70 shadow-sm space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">Part 1: Leaderboard Points</span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">Global Leaderboard Score</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {userPoints.streak} Streak
                    </span>
                    <button
                      onClick={() => setShowLeaderboardModal(true)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>View Ranks</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </div>

                {/* Part 1 Points Display */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Total Points</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
                      <Award className="w-4 h-4 text-amber-500" /> {userPoints.totalPoints.toLocaleString()} Pts
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Daily Puzzle Points</span>
                    <span className="text-xs sm:text-sm font-black text-amber-600 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-4 h-4 text-amber-500" /> {userPoints.puzzlePoints} Pts
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Puzzle Reward</span>
                    <span className="text-[11px] font-bold text-slate-700 mt-0.5">+30 Pts per solved puzzle</span>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* PART 2: ⚔️ MATCH WIN ARENA POINTS & GAME LAUNCHER */}
              {/* ========================================================================= */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-50/40 to-bambinos-50/40 p-4 rounded-2xl border border-emerald-300/70 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
                      <Swords className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">Part 2: Match Arena Rewards</span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">Points Earned After Winning Games</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <div className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 text-xs font-black flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{userPoints.matchPoints} Match Arena Pts</span>
                    </div>

                    {/* (i) Reward Structure Info Pop-Up Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRewardInfoModal(!showRewardInfoModal);
                        }}
                        className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center justify-center font-black text-xs transition-all shadow-sm active:scale-95"
                        title="View Reward Structure"
                      >
                        <Info className="w-3.5 h-3.5 text-emerald-800" />
                      </button>

                      {/* Reward Rules Pop-Up (Closes on Outside Click) */}
                      {showRewardInfoModal && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-9 z-50 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 text-left"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-black text-xs">
                                <Swords className="w-3.5 h-3.5 text-emerald-700" />
                              </div>
                              <span className="font-black text-xs text-slate-900 uppercase tracking-wider">Reward Structure</span>
                            </div>
                            <button
                              onClick={() => setShowRewardInfoModal(false)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                                Winning Match
                              </span>
                              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">+50 Pts</span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                                Draw Match
                              </span>
                              <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">+25 Pts</span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 font-bold">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
                                Playing Complete Match
                              </span>
                              <span className="font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">+10 Pts</span>
                            </div>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                                Magnus Brain Hint
                              </span>
                              <span className="font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">-20 Pts</span>
                            </div>
                          </div>

                          <div className="pt-2 text-[11px] text-slate-500 font-semibold text-center border-t border-slate-100">
                            Points accumulate automatically on your global Leaderboard profile!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Controls */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Select Time Control
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {['1 min', '3 min', '5 min', '10 min', '30 min', 'Custom'].map((tc) => (
                      <button
                        key={tc}
                        onClick={() => setSelectedTimeControl(tc)}
                        className={`py-1.5 px-2 rounded-xl font-black text-xs border transition-all ${
                          selectedTimeControl === tc
                            ? 'bg-bambinos-600 text-white border-bambinos-600 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-bambinos-300'
                        }`}
                      >
                        {tc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match Launch Action Buttons */}
                <div className="space-y-2 pt-0.5">
                  <Link
                    href="/play"
                    className="w-full py-3 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-xl shadow-lg shadow-bambinos-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 text-center"
                  >
                    <Gamepad2 className="w-5 h-5" /> Play Online Match Now
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowFriendModal(true)}
                      className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Play with Friend
                    </button>

                    <button
                      onClick={() => setShowBotModal(true)}
                      className="py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5 text-bambinos-600" /> Play AI Computer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DAILY PUZZLE ARENA (PLACED BELOW PLAY ARENA - LARGE CHESSBOARD) */}
        {/* ========================================================================= */}
        <section id="daily-puzzle" className="space-y-6 pt-2 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Daily Tactical Challenge by Coach Zaid
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Free Daily
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Auto-updated daily with interactive Coach Zaid guidance and streak tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-xs font-black text-amber-900">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Daily Streak: {trackerStats.streak} 🔥</span>
            </div>
          </div>

          {/* Large Chessboard Daily Arena View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {/* Left Column: Extra Large Interactive Chessboard */}
            <div className="lg:col-span-7 flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700 pb-1">
                <span className="flex items-center gap-2 font-black text-slate-900 text-base">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  {dailyPuzzle?.title || 'Daily Tactical Challenge'}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs whitespace-nowrap shrink-0">
                    {dailyPuzzle?.turn === 'w' ? 'White to Move' : 'Black to Move'}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs whitespace-nowrap shrink-0">
                    {dailyPuzzle?.difficulty || 'Medium'}
                  </span>
                </div>
              </div>

              {/* Extra Large Chessboard */}
              <div className="w-full flex justify-center py-2">
                <Chessboard
                  fen={dailyPuzzle?.fen}
                  onMove={handleDailyMove}
                  annotation={dailyAnnotation}
                  interactive={!dailySolved}
                  size="xl"
                  showEvalBar={true}
                />
              </div>
            </div>

            {/* Right Column: Coach Prompt, Hints & Actions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px]">
                    Today's Theme
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

              {/* Coach Zaid Guidance Card */}
              <div className="bg-bambinos-50 p-5 rounded-3xl border border-bambinos-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-bambinos-700">
                  <Volume2 className="w-4 h-4" /> Coach Zaid's Guidance
                </div>
                <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                  "{dailyPuzzle?.characterPrompt || 'Look carefully at the board and spot the tactical combination!'}"
                </p>
              </div>

              {/* Hint Box */}
              {dailyHintActive && (
                <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-xs font-bold text-amber-900 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black">Tactical Hint:</div>
                    <div className="mt-0.5">
                      Focus on forcing moves: checks, captures, and threats! Look for loose opponent pieces.
                    </div>
                  </div>
                </div>
              )}

              {/* Solved Victory Card */}
              {dailySolved && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-3xl space-y-2.5 text-center">
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

              {/* High Impact Book Demo CTA Banner */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-between text-left transition-all hover:scale-[1.02] active:scale-95 border border-amber-300/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </span>
                  <div>
                    <div className="text-xs font-black leading-tight">Master Tactics with Coach Zaid (1-on-1)</div>
                    <div className="text-[10px] font-medium text-amber-100">Book free live assessment for Unbox Chess</div>
                  </div>
                </div>
                <span className="bg-slate-950 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow shrink-0">
                  Book Demo &rarr;
                </span>
              </button>

              {/* Hint & Refresh Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDailyHintActive(!dailyHintActive)}
                  className="py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-2xl border border-amber-300 text-xs flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" /> {dailyHintActive ? 'Hide Hint' : 'Show Hint'}
                </button>

                <a
                  href="#practice-puzzles"
                  className="py-3 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-2xl shadow-md text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Extra Practice Puzzles</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EXTRA PRACTICE PUZZLES (LOCKED FOR FREE TIER - UNLOCKED FOR SUBSCRIBED) */}
        {/* ========================================================================= */}
        <section id="practice-puzzles" className="space-y-6 pt-2 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Extra Practice Puzzles Studio
                  </h2>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Unlocked
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  3 Levels of curated tactics & guided activities with Coach Zaid
                </p>
              </div>
            </div>

            {/* Level Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => {
                  setPracticeTab(1);
                  setPracticeIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  practiceTab === 1
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🟢 Level 1: Beginner</span>
              </button>

              <button
                onClick={() => {
                  setPracticeTab(2);
                  setPracticeIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  practiceTab === 2
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🟡 Level 2: Intermediate</span>
              </button>

              <button
                onClick={() => {
                  setPracticeTab(3);
                  setPracticeIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  practiceTab === 3
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🔴 Level 3: Advanced</span>
              </button>
            </div>
          </div>

          {/* UNLOCKED STUDIO VIEW (FOR ALL USERS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left List */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Level {practiceTab} Practice Pack
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {currentPracticePuzzles.length} Puzzles
                  </span>
                </div>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {currentPracticePuzzles.map((puz, idx) => {
                    const isSelected = idx === practiceIndex;
                    const isSolved = isPuzzleSolved(puz.id);

                    return (
                      <button
                        key={puz.id}
                        onClick={() => {
                          setPracticeIndex(idx);
                          setPracticeSolved(isSolved);
                          setPracticeAnnotation(null);
                          setPracticeHintActive(false);
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

              {/* Center Practice Board */}
              <div className="lg:col-span-5 flex flex-col items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700">
                  <span className="truncate flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {activePracticePuzzle?.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-bambinos-100 text-bambinos-800 font-bold text-xs shrink-0">
                    {activePracticePuzzle?.turn === 'w' ? 'White to Move' : 'Black to Move'}
                  </span>
                </div>

                <Chessboard
                  fen={activePracticePuzzle?.fen}
                  onMove={handlePracticeMove}
                  annotation={practiceAnnotation}
                  interactive={activePracticePuzzle?.puzzleType === 'standard' && !practiceSolved}
                  size="lg"
                />
              </div>

              {/* Right Side: Coach Guidance, Guided MCQ & Solved actions */}
              <div className="lg:col-span-3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div className="bg-bambinos-50 p-4 rounded-2xl border border-bambinos-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 text-bambinos-700 font-black">
                      <Volume2 className="w-4 h-4" /> Coach Zaid
                    </span>
                    <span className="bg-bambinos-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                      Level {practiceTab}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 italic">
                    "{activePracticePuzzle?.characterPrompt || activePracticePuzzle?.description}"
                  </p>
                </div>

                {/* Guided Activities */}
                {activePracticePuzzle?.puzzleType === 'guided_activity' && currentMission ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 border-b border-slate-200 pb-2">
                      <span className="uppercase text-bambinos-600">
                        Mission {practiceMissionIndex + 1} of {activeMissions.length}
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
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="font-bold text-slate-900">Tactical Objective:</p>
                    <p>{activePracticePuzzle?.description || 'Find the winning move on the board.'}</p>
                  </div>
                )}

                {/* Solved Victory Card */}
                {practiceSolved && (
                  <div className="bg-bambinos-50 border-2 border-bambinos-500 p-4 rounded-2xl space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2 text-bambinos-800 font-black text-sm">
                      <CheckCircle className="w-5 h-5 text-bambinos-600" /> Solved! Added to Tracker
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  {practiceSolved ? (
                    <button
                      onClick={() => setPracticeIndex((practiceIndex + 1) % currentPracticePuzzles.length)}
                      className="w-full py-3 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Next Practice Puzzle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPracticeHintActive(!practiceHintActive)}
                        className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 text-xs flex items-center justify-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> {practiceHintActive ? 'Hide' : 'Hint'}
                      </button>
                      <button
                        onClick={() => setPracticeIndex((practiceIndex + 1) % currentPracticePuzzles.length)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs"
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Free Tier Sign-up & Subscribed Student Auth Gate */}
      <FreeSignUpModal
        isOpen={showAuthModal}
        onSuccess={(userData, isSubscribed) => {
          setCurrentUser(userData);
          if (isSubscribed) {
            setUserTier('subscribed');
          } else {
            setUserTier('free');
          }
          setShowAuthModal(false);
        }}
      />

      {/* 2. Interactive Book Demo Modal */}
      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* 3. Play with Friend Modal */}
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
              <button
                onClick={() => {
                  setShowFriendModal(false);
                  window.location.hash = 'play-arena';
                }}
                className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                🎮 Start Local Pass & Play
              </button>

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

      {/* 4. Choose Bot Modal */}
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
                { name: 'UnboxChessMaster', rating: 1200, style: 'Solid positional London System' },
                { name: 'Grandmaster AI', rating: 2200, style: 'Stockfish evaluation depth 15' }
              ].map((bot, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowBotModal(false);
                    alert(`Starting match against ${bot.name} (${bot.rating} Elo)!`);
                  }}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-bambinos-50 border border-slate-200 hover:border-bambinos-300 flex items-center justify-between transition-all text-left group"
                >
                  <div>
                    <div className="text-sm font-black text-slate-900 group-hover:text-bambinos-700">{bot.name}</div>
                    <div className="text-xs font-medium text-slate-500">{bot.style}</div>
                  </div>
                  <span className="px-3 py-1 bg-bambinos-600 text-white font-black text-xs rounded-xl shadow-sm">
                    {bot.rating} Elo
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Game History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bambinos-600 text-white flex items-center justify-center shadow-md">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Game History</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Total {totalGamesPlayed} matches played • {winsCount} Wins, {lossesCount} Losses, {drawsCount} Draws
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {gameHistoryList.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs ${item.result === 'win' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {item.result === 'win' ? '+' : '-'}
                    </div>
                    <img src={item.opponentAvatar} alt={item.opponent} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <span>{item.opponent}</span>
                        <span className="text-xs font-bold text-slate-400">({item.opponentRating})</span>
                      </div>
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.movesCount} moves</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs font-extrabold text-slate-700">
                    {item.accuracy}% Accuracy
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Unbox Chess Tracker</span>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />
    </div>
  );
}
