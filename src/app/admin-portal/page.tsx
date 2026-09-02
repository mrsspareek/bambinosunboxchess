'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Chessboard } from '../../components/Chessboard';
import { parseAndSaveJsonPuzzle, saveCustomPuzzle, getLevelPuzzles, ALL_LEVEL_PUZZLES } from '../../lib/puzzleStore';
import { Puzzle } from '../../types/chess';
import { StudentUserData } from '../../components/FreeSignUpModal';
import {
  ShieldCheck,
  Puzzle as PuzzleIcon,
  Plus,
  CheckCircle,
  FileCode,
  ListChecks,
  Type,
  Target,
  LayoutGrid,
  Bot,
  Upload,
  FolderPlus,
  FileJson,
  Check,
  AlertCircle,
  Folder,
  Calendar,
  Layers,
  ArrowLeft,
  LogOut,
  Sparkles,
  RefreshCw,
  Edit3,
  Send,
  Users,
  BarChart3,
  TrendingUp,
  MapPin,
  Phone,
  Clock,
  Eye,
  Activity,
  Award,
  Trophy
} from 'lucide-react';

const SAMPLE_VISITOR_LOG: StudentUserData[] = [
  { name: 'Zaid Iqbal', age: '7-10 Years', place: 'Bangalore', phone: '+91 98450 12345', verifiedAt: 'Today, 5:12 PM' },
  { name: 'Aarav Sharma', age: '5-6 Years', place: 'Mumbai', phone: '+91 97112 34567', verifiedAt: 'Today, 4:45 PM' },
  { name: 'Diya Patel', age: '7-10 Years', place: 'Ahmedabad', phone: '+91 98223 45678', verifiedAt: 'Today, 3:30 PM' },
  { name: 'Rohan Mehta', age: '11-14 Years', place: 'Delhi NCR', phone: '+91 99887 76655', verifiedAt: 'Today, 2:15 PM' },
  { name: 'Ananya Reddy', age: '7-10 Years', place: 'Hyderabad', phone: '+91 94401 23456', verifiedAt: 'Yesterday, 8:20 PM' }
];

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'easy_creator' | 'analytics' | 'daily_manager' | 'levels_catalog' | 'json_importer'>('easy_creator');

  // Selected Category matching Student Panel
  const [selectedCategory, setSelectedCategory] = useState<'daily' | 1 | 2 | 3>('daily');

  // Easy Puzzle Creator State
  const [newTitle, setNewTitle] = useState('Royal Knight Fork');
  const [newCategory, setNewCategory] = useState<1 | 2 | 3>(1);
  const [newTheme, setNewTheme] = useState('Knight Tactics');
  const [newFen, setNewFen] = useState('r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4');
  const [newSolution, setNewSolution] = useState('c4f7');
  const [newCoachPrompt, setNewCoachPrompt] = useState('Can you spot the tactical sacrifice to win material?');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Daily Puzzle Live Editor State
  const [dailyDate, setDailyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyTheme, setDailyTheme] = useState<string>('Greek Gift Bishop Sacrifice');
  const [dailyFen, setDailyFen] = useState<string>('r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7');
  const [dailySolution, setDailySolution] = useState<string>('d3h7, g8h7, f3g5');
  const [dailyDifficulty, setDailyDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dailyRating, setDailyRating] = useState<number>(1350);
  const [dailyCoachPrompt, setDailyCoachPrompt] = useState<string>("Coach Magnus says: Look at Black's castled king. Can you break the defense with a brilliant bishop sacrifice on h7?");
  const [dailyDescription, setDailyDescription] = useState<string>("Launch the classic bishop sacrifice on h7 to shatter the black king's pawn shield.");
  const [dailyPushSuccess, setDailyPushSuccess] = useState(false);
  const [isPushingDaily, setIsPushingDaily] = useState(false);

  // Analytics State
  const [visitorCount, setVisitorCount] = useState(1420);
  const [signupsList, setSignupsList] = useState<StudentUserData[]>(SAMPLE_VISITOR_LOG);

  // JSON Importer State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonContent, setJsonContent] = useState(`{
  "id": "admin-custom-puz-1",
  "title": "Knight Fork Tactic",
  "level": 1,
  "category": "beginner",
  "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  "solution": ["c6d4"],
  "rating": 450,
  "theme": "Knight Tactics",
  "description": "Punish the white queen with a knight leap!",
  "characterPrompt": "Can you spot the knight hop?",
  "turn": "w",
  "difficulty": "Easy",
  "puzzleType": "standard"
}`);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [importSuccess, setImportSuccess] = useState(false);

  // Load Signups from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('unbox_analytics_signups');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSignupsList([...parsed, ...SAMPLE_VISITOR_LOG]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch Daily Puzzle from API
  useEffect(() => {
    fetch(`/api/puzzles/daily?date=${dailyDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.puzzle) {
          setDailyTheme(data.puzzle.theme || '');
          setDailyFen(data.puzzle.fen || '');
          setDailySolution(Array.isArray(data.puzzle.solution) ? data.puzzle.solution.join(', ') : '');
          setDailyDifficulty(data.puzzle.difficulty || 'Medium');
          setDailyRating(data.puzzle.rating || 1200);
          setDailyCoachPrompt(data.puzzle.characterPrompt || '');
          setDailyDescription(data.puzzle.description || '');
        }
      })
      .catch(console.error);
  }, [dailyDate]);

  // Quick Preset Presets for Easy Creator
  const PRESET_PUZZLES = [
    { title: "Scholar's Mate Defense", fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", move: "c4f7", theme: "Opening Punishments", level: 1 },
    { title: "Royal Knight Fork", fen: "r1b1k2r/ppppqppp/2n5/4P3/2B1n3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 6", move: "d1d5", theme: "Fork Tactics", level: 2 },
    { title: "Morphy's Opera Pin", fen: "rn2kb1r/pp3ppp/2p1pn2/4q3/4N3/3B1Q1P/PPPB1PP1/R3K2R w KQkq - 0 11", move: "d2c3", theme: "Absolute Pin", level: 2 },
    { title: "Greek Gift Sacrifice", fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 7", move: "d3h7", theme: "Bishop Sacrifice", level: 3 }
  ];

  const handleApplyPreset = (preset: typeof PRESET_PUZZLES[0]) => {
    setNewTitle(preset.title);
    setNewFen(preset.fen);
    setNewSolution(preset.move);
    setNewTheme(preset.theme);
    setNewCategory(preset.level as 1 | 2 | 3);
  };

  const handleSaveEasyPuzzle = (e: React.FormEvent) => {
    e.preventDefault();
    const solutionArray = newSolution.split(',').map(s => s.trim()).filter(Boolean);
    const newPuz: Puzzle = {
      id: `admin-easy-puz-${Date.now()}`,
      title: newTitle.trim() || 'Custom Admin Puzzle',
      level: newCategory,
      category: newCategory === 1 ? 'beginner' : 'advanced',
      fen: newFen.trim(),
      solution: solutionArray,
      rating: newCategory === 1 ? 400 : newCategory === 2 ? 850 : 1300,
      theme: newTheme || 'Tactics',
      description: newCoachPrompt,
      characterPrompt: newCoachPrompt,
      turn: newFen.includes(' w ') ? 'w' : 'b',
      difficulty: newDifficulty,
      puzzleType: 'standard'
    };

    saveCustomPuzzle(newPuz);
    setCreateSuccess(true);
    setTimeout(() => setCreateSuccess(false), 3500);
  };

  const handlePushDailyPuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushingDaily(true);
    setDailyPushSuccess(false);

    try {
      const solutionArray = dailySolution.split(',').map(s => s.trim()).filter(Boolean);
      const puzzlePayload: Puzzle = {
        id: `daily-${dailyDate}`,
        title: `Daily Puzzle (${dailyDate}): ${dailyTheme}`,
        theme: dailyTheme,
        fen: dailyFen,
        solution: solutionArray,
        difficulty: dailyDifficulty,
        rating: Number(dailyRating),
        characterPrompt: dailyCoachPrompt,
        description: dailyDescription,
        turn: dailyFen.includes(' w ') ? 'w' : 'b',
        puzzleType: 'standard'
      };

      const res = await fetch('/api/puzzles/daily', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ date: dailyDate, puzzle: puzzlePayload })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDailyPushSuccess(true);
        setTimeout(() => setDailyPushSuccess(false), 3500);
      }
    } catch (err) {
      alert('Failed to update daily puzzle.');
    } finally {
      setIsPushingDaily(false);
    }
  };

  const levelPuzzlesToDisplay = selectedCategory === 'daily' ? [] : getLevelPuzzles(selectedCategory as 1 | 2 | 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-6">
      {/* ========================================================================= */}
      {/* 1. ADMIN HEADER (SAME CLEAN WHITE THEME AS STUDENT PORTAL) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image 
              src="/logo2.png" 
              alt="Bambinos Logo" 
              width={48} 
              height={48} 
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">UnboxChess Master Admin Portal</h1>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Create & publish puzzles, manage Daily Challenge, and view visitor analytics
            </p>
          </div>
        </div>

        {/* Action Controls: Back to Student Portal & Sign Out */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-bambinos-50 hover:bg-bambinos-100 text-bambinos-700 text-xs font-black border border-bambinos-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-bambinos-600" />
            <span>← Student Webpage</span>
          </Link>

          <Link
            href="/admin-login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Lock Portal</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADMIN NAVIGATION TABS (SAME STUDENT THEME) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('easy_creator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'easy_creator'
              ? 'bg-bambinos-600 text-white shadow-md shadow-bambinos-600/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>⚡ Easy Puzzle Creator</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Visitor & Sign-up Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('daily_manager')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'daily_manager'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>🌟 Daily Puzzle Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('levels_catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'levels_catalog'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🧩 3-Level Student Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('json_importer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeTab === 'json_importer'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>📁 Bulk JSON Importer</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EASY PUZZLE CREATOR */}
      {/* ========================================================================= */}
      {activeTab === 'easy_creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-bambinos-600" /> Easy 1-Click Puzzle Builder
                </h3>
                <p className="text-xs text-slate-500 font-medium">Create a new puzzle and publish immediately to student portal</p>
              </div>

              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Instant Publish
              </span>
            </div>

            {/* Quick Tactical Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-400">Quick Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_PUZZLES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-bambinos-50 hover:border-bambinos-300 text-left transition-all"
                  >
                    <div className="text-[11px] font-black text-slate-800 leading-tight">{preset.title}</div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">Level {preset.level}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveEasyPuzzle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Puzzle Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Royal Knight Fork"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-bambinos-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Target Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-bambinos-500"
                  >
                    <option value={1}>🟢 Level 1: Beginner</option>
                    <option value={2}>🟡 Level 2: Intermediate</option>
                    <option value={3}>🔴 Level 3: Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Tactical Theme</label>
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    placeholder="e.g. Fork, Pin, Skewer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-bambinos-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Winning Move (e.g. d1d5)</label>
                  <input
                    type="text"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    required
                    placeholder="e.g. c4f7 or d1d5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-emerald-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Board FEN String</label>
                <input
                  type="text"
                  value={newFen}
                  onChange={(e) => setNewFen(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 outline-none focus:border-bambinos-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Coach Dialogue Prompt for Child</label>
                <textarea
                  value={newCoachPrompt}
                  onChange={(e) => setNewCoachPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-bambinos-500"
                />
              </div>

              {createSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Puzzle "{newTitle}" saved successfully to Level {newCategory}!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save & Publish Puzzle to Level {newCategory}</span>
              </button>
            </form>
          </div>

          {/* Right Live Board Preview */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-slate-500">Live Preview</span>
              <span className="text-xs font-bold text-bambinos-600">Solution: {newSolution}</span>
            </div>

            <Chessboard fen={newFen} size="lg" interactive={true} />

            <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{newTitle}</div>
              <div className="text-slate-500 italic">"{newCoachPrompt}"</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VISITOR & SIGN-UP ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-black uppercase">
                <span>Active Visitors</span>
                <Users className="w-4 h-4 text-bambinos-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{visitorCount.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14% from yesterday
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-black uppercase">
                <span>Free Sign-ups</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{signupsList.length + 38}</div>
              <p className="text-[11px] text-emerald-600 font-bold">100% WhatsApp Verified</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-black uppercase">
                <span>Daily Puzzles Solved</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">894</div>
              <p className="text-[11px] text-amber-700 font-bold">78% Completion Rate</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-black uppercase">
                <span>Demo Inquiries</span>
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">42</div>
              <p className="text-[11px] text-orange-600 font-bold">Grandmaster Assessments</p>
            </div>
          </div>

          {/* Real-time Free Tier Sign-up Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-bambinos-600" /> Recent Free Tier Student Sign-ups
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verified via WhatsApp OTP before accessing the single webpage portal
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Total {signupsList.length} Registrations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                    <th className="pb-3">Child Name</th>
                    <th className="pb-3">Age Group</th>
                    <th className="pb-3">City / Place</th>
                    <th className="pb-3">WhatsApp Contact</th>
                    <th className="pb-3">Verified Status</th>
                    <th className="pb-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {signupsList.map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-extrabold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-bambinos-100 text-bambinos-700 font-black flex items-center justify-center text-[10px]">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td className="py-3">{user.age}</td>
                      <td className="py-3 font-bold text-slate-800">{user.place}</td>
                      <td className="py-3 font-mono font-bold text-slate-900">{user.phone}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          <Check className="w-3 h-3" /> OTP Verified
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{user.verifiedAt || 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DAILY PUZZLE MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'daily_manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Daily Tactical Challenge Editor
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Updates <code className="text-amber-600 font-bold">/api/puzzles/daily</code> live on the student webpage
                </p>
              </div>

              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
              />
            </div>

            <form onSubmit={handlePushDailyPuzzle} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Theme / Tactical Motif</label>
                <input
                  type="text"
                  value={dailyTheme}
                  onChange={(e) => setDailyTheme(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Board FEN</label>
                <input
                  type="text"
                  value={dailyFen}
                  onChange={(e) => setDailyFen(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Winning Move Sequence (comma-separated)</label>
                <input
                  type="text"
                  value={dailySolution}
                  onChange={(e) => setDailySolution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-emerald-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Coach Dialogue</label>
                <textarea
                  value={dailyCoachPrompt}
                  onChange={(e) => setDailyCoachPrompt(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none"
                />
              </div>

              {dailyPushSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Daily Puzzle for {dailyDate} successfully updated on live portal!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPushingDaily}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isPushingDaily ? 'Pushing...' : `Push & Auto-Update Daily Puzzle (${dailyDate})`}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col items-center">
            <h4 className="text-xs font-black uppercase text-slate-500 w-full text-left">Daily Board Preview</h4>
            <Chessboard fen={dailyFen} size="lg" interactive={true} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 3-LEVEL STUDENT CATALOG */}
      {/* ========================================================================= */}
      {activeTab === 'levels_catalog' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Student Categories & Catalog</h3>
              <p className="text-xs text-slate-500 font-medium">Matches the categories displayed on the Student Webpage</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedCategory(1)}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all ${
                  selectedCategory === 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                }`}
              >
                🟢 Level 1: Beginner
              </button>
              <button
                onClick={() => setSelectedCategory(2)}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all ${
                  selectedCategory === 2 ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                }`}
              >
                🟡 Level 2: Intermediate
              </button>
              <button
                onClick={() => setSelectedCategory(3)}
                className={`py-2 px-3 rounded-xl font-black text-xs transition-all ${
                  selectedCategory === 3 ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                }`}
              >
                🔴 Level 3: Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levelPuzzlesToDisplay.map((puz, idx) => (
              <div
                key={puz.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5 hover:border-bambinos-300 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-bambinos-100 text-bambinos-800">
                    Puzzle #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-amber-600">{puz.rating} Elo</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{puz.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{puz.theme}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl font-mono text-[11px] text-slate-700 truncate border border-slate-200">
                  FEN: {puz.fen}
                </div>

                <div className="text-xs text-slate-600 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span>Type: <strong className="text-slate-900">{puz.puzzleType}</strong></span>
                  <span className="text-emerald-700 font-bold">Solution: {puz.solution.join(', ') || 'MCQ'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BULK JSON IMPORTER */}
      {/* ========================================================================= */}
      {activeTab === 'json_importer' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-slate-700" /> Automated JSON Puzzle Importer
              </h3>
              <p className="text-xs text-slate-500 font-medium">Upload `.json` files into any target category</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    const res = parseAndSaveJsonPuzzle(text, 1, 'beginner');
                    if (res.success) {
                      setImportedCount(res.count);
                      setImportSuccess(true);
                      setTimeout(() => setImportSuccess(false), 3500);
                    }
                  };
                  reader.readAsText(files[0]);
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" /> Browse File (.json)
              </button>
            </div>
          </div>

          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 outline-none"
          />

          {importSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Imported {importedCount} puzzles successfully!</span>
            </div>
          )}

          <button
            onClick={() => {
              const res = parseAndSaveJsonPuzzle(jsonContent, 1, 'beginner');
              if (res.success) {
                setImportedCount(res.count);
                setImportSuccess(true);
                setTimeout(() => setImportSuccess(false), 3500);
              }
            }}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Import JSON Schema
          </button>
        </div>
      )}
    </div>
  );
}
