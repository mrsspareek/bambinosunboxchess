'use client';

import React, { useState } from 'react';
import { saveCustomPuzzle } from '../../lib/puzzleStore';
import { saveCustomActivity } from '../../lib/activityStore';
import { Puzzle, Activity, ActivityType } from '../../types/chess';
import { Settings, FileCode, PlusCircle, CheckCircle, ListChecks, Type, Target, LayoutGrid, Bot, Upload } from 'lucide-react';

export default function AdminPage() {
  const [activeMode, setActiveMode] = useState<'json_puzzle' | 'activity_studio'>('activity_studio');
  const [activeTab, setActiveTab] = useState<'position' | 'activities'>('activities');

  // Activity Studio Form State matching Zing screenshot
  const [puzzleName, setPuzzleName] = useState('Back-rank mate');
  const [puzzleDesc, setPuzzleDesc] = useState('');
  const [fenString, setFenString] = useState('6k1/5ppp/8/8/8/8/8/1R4K1 w - - 0 1');
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // JSON Importer State
  const [jsonContent, setJsonContent] = useState(`{
  "id": "custom-puz-101",
  "title": "Scholar's Mate Punishment",
  "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  "solution": ["c6d4"],
  "rating": 450,
  "theme": "Opening Trap",
  "description": "Punish the early queen raid by capturing the knight!",
  "characterPrompt": "Can you spot the winning knight hop?",
  "turn": "w",
  "difficulty": "Easy"
}`);

  const handleCreateActivity = (type: ActivityType) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type,
      title: puzzleName || 'Untitled Activity',
      description: puzzleDesc || 'Custom interactive activity created in Zing Admin Studio',
      fen: fenString,
      options: type === 'multiple_choice' ? ['Rook e8', 'Knight f3', 'Pawn e4', 'King h1'] : undefined,
      correctAnswer: type === 'fill_blank' ? 'e8' : type === 'click_square' ? 'g8' : 'e8'
    };

    saveCustomActivity(newActivity);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleImportJson = () => {
    try {
      const parsed: Puzzle = JSON.parse(jsonContent);
      saveCustomPuzzle(parsed);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Invalid JSON Format! Please check schema.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Admin Content Studio</h1>
            <p className="text-slate-500 font-medium text-sm">Design custom puzzles, JSON imports, and Zing interactive drills</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveMode('activity_studio')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeMode === 'activity_studio' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Activity Studio
          </button>
          <button
            onClick={() => setActiveMode('json_puzzle')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeMode === 'json_puzzle' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            JSON Puzzle Importer
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl font-black flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          Successfully saved into platform database!
        </div>
      )}

      {activeMode === 'activity_studio' ? (
        /* Zing Activity Studio Layout Matching Screenshot */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          {/* Top Tabs: Position | Activities */}
          <div className="flex justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('position')}
                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'position' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Position
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'activities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Activities
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left/Main Form Section */}
            <div className="space-y-6">
              {activeTab === 'position' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">FEN String Position Setup</label>
                  <input
                    type="text"
                    value={fenString}
                    onChange={(e) => setFenString(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-bambinos-600"
                  />
                  <p className="text-xs text-slate-400 font-medium">Standard Chess FEN format representation of piece locations.</p>
                </div>
              ) : (
                /* ACTIVITIES drawer matching screenshot media_1788162988274.png */
                <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">ACTIVITIES</span>
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center">0</span>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Multiple choice */}
                    <div
                      onClick={() => handleCreateActivity('multiple_choice')}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-bambinos-400 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 group-hover:text-bambinos-600">
                        <ListChecks className="w-4 h-4 text-slate-400 group-hover:text-bambinos-600" /> Multiple choice
                      </div>
                      <p className="text-xs text-slate-500 font-medium pl-6">A question about the position with a few answers to pick from.</p>
                    </div>

                    {/* 2. Fill in the blank */}
                    <div
                      onClick={() => handleCreateActivity('fill_blank')}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-bambinos-400 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 group-hover:text-bambinos-600">
                        <Type className="w-4 h-4 text-slate-400 group-hover:text-bambinos-600" /> Fill in the blank
                      </div>
                      <p className="text-xs text-slate-500 font-medium pl-6">The child types the answer — a square, a piece, a word.</p>
                    </div>

                    {/* 3. Click the square */}
                    <div
                      onClick={() => handleCreateActivity('click_square')}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-bambinos-400 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 group-hover:text-bambinos-600">
                        <Target className="w-4 h-4 text-slate-400 group-hover:text-bambinos-600" /> Click the square
                      </div>
                      <p className="text-xs text-slate-500 font-medium pl-6">The child finds squares on the board. Nothing is highlighted for them.</p>
                    </div>

                    {/* 4. Place the pieces */}
                    <div
                      onClick={() => handleCreateActivity('place_pieces')}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-bambinos-400 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 group-hover:text-bambinos-600">
                        <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-bambinos-600" /> Place the pieces
                      </div>
                      <p className="text-xs text-slate-500 font-medium pl-6">The child rebuilds the position from a tray of pieces.</p>
                    </div>

                    {/* 5. Play the bot */}
                    <div
                      onClick={() => handleCreateActivity('play_bot')}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-bambinos-400 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 group-hover:text-bambinos-600">
                        <Bot className="w-4 h-4 text-slate-400 group-hover:text-bambinos-600" /> Play the bot
                      </div>
                      <p className="text-xs text-slate-500 font-medium pl-6">The child plays the position out against the bot.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Details Panel matching screenshot */}
            <div className="space-y-6">
              {/* Ready status box */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-extrabold">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                This position is ready to play.
              </div>

              {/* DETAILS form */}
              <div className="space-y-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">DETAILS</span>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1">PUZZLE NAME</label>
                  <input
                    type="text"
                    value={puzzleName}
                    onChange={(e) => setPuzzleName(e.target.value)}
                    placeholder="Back-rank mate"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                    DESCRIPTION <span className="text-slate-400 lowercase">optional</span>
                  </label>
                  <textarea
                    value={puzzleDesc}
                    onChange={(e) => setPuzzleDesc(e.target.value)}
                    placeholder="What is this puzzle for? e.g. the rook ladder technique"
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* JSON Importer Mode */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-bambinos-600" /> Bulk JSON Puzzle Import
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Paste custom puzzle JSON format containing FEN string, expected moves array, rating, and character dialogue prompts.
          </p>

          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-bambinos-600 bg-slate-50"
          />

          <button
            onClick={handleImportJson}
            className="py-4 px-8 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" /> Import JSON Puzzle
          </button>
        </div>
      )}
    </div>
  );
}
