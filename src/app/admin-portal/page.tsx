'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { parseAndSaveJsonPuzzle, saveCustomPuzzle } from '../../lib/puzzleStore';
import { saveCustomActivity } from '../../lib/activityStore';
import { Puzzle, Activity, ActivityType } from '../../types/chess';
import { ShieldCheck, DollarSign, BookOpen, Puzzle as PuzzleIcon, Users, Lock, Plus, CheckCircle, FileCode, ListChecks, Type, Target, LayoutGrid, Bot, Upload, Tag, TrendingUp, FolderPlus, FileJson, Check, AlertCircle, Folder } from 'lucide-react';

interface CoursePackage {
  id: string;
  name: string;
  price: number;
  ageGroup: string;
  sessionsCount: number;
  studentsEnrolled: number;
  status: 'Active' | 'Draft';
}

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'curriculum' | 'puzzles' | 'reports'>('puzzles');

  // Selected Target Category & Session Folder
  const [selectedCategory, setSelectedCategory] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedSessionFolderNum, setSelectedSessionFolderNum] = useState<number>(1);

  // Course Selling State
  const [courses, setCourses] = useState<CoursePackage[]>([
    { id: 'c-1', name: 'Unbox Chess Beginner Masterclass (48 Sessions)', price: 199, ageGroup: '7-10 Years', sessionsCount: 48, studentsEnrolled: 840, status: 'Active' },
    { id: 'c-2', name: 'Unbox Chess Intermediate Tactics & Openings', price: 249, ageGroup: '10+ Years', sessionsCount: 36, studentsEnrolled: 400, status: 'Active' },
    { id: 'c-3', name: '1-on-1 Live Grandmaster Coaching', price: 99, ageGroup: 'All Ages', sessionsCount: 4, studentsEnrolled: 120, status: 'Active' }
  ]);

  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(199);
  const [newCourseAge, setNewCourseAge] = useState('7-10 Years');

  // Activity Studio State
  const [puzzleName, setPuzzleName] = useState('Back-rank mate');
  const [puzzleDesc, setPuzzleDesc] = useState('');
  const [fenString, setFenString] = useState('6k1/5ppp/8/8/8/8/8/1R4K1 w - - 0 1');
  const [studioTab, setStudioTab] = useState<'position' | 'activities' | 'json_import'>('json_import');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importedPuzzleCount, setImportedPuzzleCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jsonContent, setJsonContent] = useState(`{
  "id": "guided-puzzle-1-piece-coordinates",
  "title": "Guided Puzzle 1: Piece Coordinates",
  "sessionNumber": 1,
  "category": "beginner",
  "fen": "6k1/8/8/2b1p3/4P3/2N5/8/6K1 w - - 0 1",
  "rating": 300,
  "theme": "Coordinates and Piece Values",
  "description": "Read the board, identify exact chessboard coordinates, and recall basic material values.",
  "characterPrompt": "Can you read the board, find the correct square, and remember which pieces are worth 3 points?",
  "turn": "w",
  "difficulty": "Easy",
  "puzzleType": "guided_activity",
  "activities": [
    {
      "id": "mission-1",
      "type": "mcq",
      "question": "What is the coordinate of the White Pawn?",
      "helper": "Look at the file letter first, then the rank number.",
      "choices": ["e4", "d4", "e5", "c3"],
      "answer": "e4",
      "focusSquare": "e4",
      "hint": "Find the White Pawn, then read the file letter and rank number."
    },
    {
      "id": "mission-2",
      "type": "mcq",
      "question": "What is the coordinate of the Black Bishop?",
      "helper": "Find the dark bishop, then read File + Rank.",
      "choices": ["c5", "c4", "e5", "b5"],
      "answer": "c5",
      "focusSquare": "c5",
      "hint": "The Bishop is on the c-file and the 5th rank."
    },
    {
      "id": "mission-3",
      "type": "mcq",
      "question": "Which piece is worth 3 points?",
      "helper": "Recall the material values from the lesson.",
      "choices": ["Knight only", "Bishop only", "Both Knight and Bishop", "Pawn"],
      "answer": "Both Knight and Bishop",
      "focusSquare": null,
      "hint": "Two different minor pieces share the same value."
    }
  ]
}`);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'unboxchess') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Admin Passcode! Use "admin123"');
    }
  };

  const handleAddCourse = () => {
    if (!newCourseName) return;
    const newC: CoursePackage = {
      id: `c-${Date.now()}`,
      name: newCourseName,
      price: newCoursePrice,
      ageGroup: newCourseAge,
      sessionsCount: 48,
      studentsEnrolled: 0,
      status: 'Active'
    };
    setCourses([...courses, newC]);
    setNewCourseName('');
    alert('Course Package Created Successfully!');
  };

  const handleCreateActivity = (type: ActivityType) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type,
      title: puzzleName || 'Untitled Activity',
      description: puzzleDesc || 'Custom interactive activity created in Zing Admin Studio',
      fen: fenString,
      options: type === 'multiple_choice' || type === 'mcq' ? ['Rook e8', 'Knight f3', 'Pawn e4', 'King h1'] : undefined,
      correctAnswer: type === 'fill_blank' ? 'e8' : type === 'click_square' ? 'g8' : 'e8'
    };

    saveCustomActivity(newActivity);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = parseAndSaveJsonPuzzle(text, selectedSessionFolderNum, selectedCategory);
        if (res.success) {
          setImportedPuzzleCount(res.count);
          setJsonContent(text);
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 4000);
        } else {
          alert('Error parsing JSON file!');
        }
      } catch (err) {
        alert('Error reading JSON file!');
      }
    };

    reader.readAsText(file);
  };

  const handleImportJsonText = () => {
    const res = parseAndSaveJsonPuzzle(jsonContent, selectedSessionFolderNum, selectedCategory);
    if (res.success) {
      setImportedPuzzleCount(res.count);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      alert('Invalid JSON Format! Please check schema syntax.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-bambinos-600 rounded-2xl p-2 flex items-center justify-center mx-auto shadow-lg">
            <Image src="/logo.png" alt="Bambinos Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">UnboxChess Admin Portal</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Enter admin passcode to manage courses, puzzles & curriculum</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Passcode (admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-bold text-center text-sm"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Unlock Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Portal Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-bambinos-600 p-2 flex items-center justify-center shadow-lg">
            <Image src="/logo.png" alt="Bambinos Logo" width={44} height={44} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">UnboxChess Master Admin Portal</h1>
            <p className="text-slate-400 font-medium text-xs mt-0.5">Manage courses, subscriptions, 48-session curriculum, puzzles & Zing activities</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
        >
          Lock Portal
        </button>
      </div>

      {/* Primary Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'overview', label: 'Platform Overview', icon: TrendingUp },
          { id: 'courses', label: 'Course Selling & Packages', icon: DollarSign },
          { id: 'curriculum', label: 'Curriculum Manager (48 Sessions)', icon: BookOpen },
          { id: 'puzzles', label: 'Puzzle & Session Studio', icon: PuzzleIcon },
          { id: 'reports', label: 'Student & Sales Reports', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-bambinos-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl font-black flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          Successfully imported {importedPuzzleCount > 0 ? `${importedPuzzleCount} puzzle(s)` : 'activity'} into {selectedCategory.toUpperCase()} Session {selectedSessionFolderNum} Folder!
        </div>
      )}

      {/* TAB: PUZZLE & ZING ACTIVITY STUDIO */}
      {activeTab === 'puzzles' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Session Folders & JSON Puzzle Importer</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Automate puzzle & activity imports for Beginner (48) and Advanced (36) Session Folders</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />

            {/* Target Category & Session Folder Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                <span>Track:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'beginner' | 'advanced')}
                  className="bg-white px-2 py-1 rounded-xl border border-slate-300 font-extrabold text-bambinos-700"
                >
                  <option value="beginner">Beginner (48 Sessions)</option>
                  <option value="advanced">Advanced (36 Sessions)</option>
                </select>

                <span>Session:</span>
                <select
                  value={selectedSessionFolderNum}
                  onChange={(e) => setSelectedSessionFolderNum(+e.target.value)}
                  className="bg-white px-2 py-1 rounded-xl border border-slate-300 font-extrabold text-bambinos-800"
                >
                  {Array.from({ length: selectedCategory === 'beginner' ? 48 : 36 }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>Session {s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-transform active:scale-95"
              >
                <FolderPlus className="w-4 h-4" /> Upload JSON File
              </button>
            </div>
          </div>

          {studioTab === 'json_import' ? (
            /* Automated JSON Importer Box */
            <div className="space-y-4">
              <div className="bg-bambinos-50 border border-bambinos-200 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-bambinos-900">
                <span className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-bambinos-600" />
                  Target: <strong className="uppercase">{selectedCategory} Track</strong> &bull; <strong className="uppercase">Session {selectedSessionFolderNum} Folder</strong>
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-bambinos-600 text-white rounded-xl font-black text-xs hover:bg-bambinos-700 shadow-md"
                >
                  Browse File (.json)
                </button>
              </div>

              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                rows={14}
                className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-bambinos-600 bg-slate-50 text-slate-800"
              />

              <button
                onClick={handleImportJsonText}
                className="py-4 px-8 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" /> Import Puzzles into {selectedCategory.toUpperCase()} Session {selectedSessionFolderNum} Folder
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
