'use client';

import React, { useState } from 'react';
import { Chessboard } from '../../components/Chessboard';
import { getPuzzles, getSessionFolders } from '../../lib/puzzleStore';
import { Puzzle, MoveAnnotation, GuidedActivity } from '../../types/chess';
import { Puzzle as PuzzleIcon, Folder, FolderOpen, Sparkles, Volume2, HelpCircle, CheckCircle, Flame, ArrowRight, Award, Check, X, Target, HelpCircle as QuestionMark, ChevronDown, ChevronUp } from 'lucide-react';

export default function PuzzlesPage() {
  const [activeCategory, setActiveCategory] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(1);
  const [showMobileFolderList, setShowMobileFolderList] = useState(false);

  // Session Folders for selected Category
  const sessionFolders = getSessionFolders(activeCategory);
  const activeFolder = sessionFolders.find(f => f.sessionNumber === selectedSessionNum) || sessionFolders[0];
  const activePuzzles = activeFolder.puzzles.length > 0 ? activeFolder.puzzles : getPuzzles();

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle: Puzzle = activePuzzles[currentPuzzleIndex] || activePuzzles[0];

  // Guided Activity Mission State
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<string | null>(null);
  const [missionStatus, setMissionStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Stats
  const [rating, setRating] = useState(326);
  const [streak, setStreak] = useState(4);
  const [solved, setSolved] = useState(false);
  const [showLevelCard, setShowLevelCard] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [annotation, setAnnotation] = useState<MoveAnnotation | null>(null);

  const activeMissions: GuidedActivity[] = currentPuzzle?.activities || [];
  const currentMission: GuidedActivity | undefined = activeMissions[currentMissionIndex];

  const handleMcqSelect = (choice: string) => {
    if (!currentMission) return;

    setSelectedMcqAnswer(choice);
    if (choice === currentMission.answer) {
      setMissionStatus('correct');
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
          setSolved(true);
          const bonus = 40;
          setRating(prev => prev + bonus);
          setStreak(prev => prev + 1);
        }
      }, 1200);
    } else {
      setMissionStatus('wrong');
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
      setSolved(true);
      setAnnotation({ type: 'brilliant', symbol: '!!', label: 'Solved!', square: to });
      const bonus = 40;
      setRating(prev => prev + bonus);
      setStreak(prev => prev + 1);
    } else {
      setAnnotation({ type: 'blunder', symbol: '??', label: 'Incorrect Move', square: to });
    }
  };

  const handleNextPuzzle = () => {
    setSolved(false);
    setShowLevelCard(false);
    setHintActive(false);
    setAnnotation(null);
    setCurrentMissionIndex(0);
    setSelectedMcqAnswer(null);
    setMissionStatus('idle');
    setCurrentPuzzleIndex(prev => (prev + 1) % activePuzzles.length);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30 shrink-0">
            <PuzzleIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Chess Puzzles & Guided Activity Studio</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">Session-wise structured folders for Beginner & Advanced tracks</p>
          </div>
        </div>

        {/* Rating & Streak Indicators */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl flex items-center gap-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-amber-700 uppercase">Streak</div>
              <div className="text-base sm:text-lg font-black text-amber-900">{streak} 🔥</div>
            </div>
          </div>
          <div className="bg-bambinos-50 border border-bambinos-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-bambinos-600" />
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-bambinos-700 uppercase">Rating</div>
              <div className="text-base sm:text-lg font-black text-bambinos-900">{rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Session Folder Drawer (Collapsible on Mobile, Expanded on Desktop) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-bambinos-600" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                {activeCategory === 'beginner' ? 'Beginner' : 'Adv'} S{selectedSessionNum}
              </span>
            </div>

            <button
              onClick={() => setShowMobileFolderList(!showMobileFolderList)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1"
            >
              <span>Folders</span>
              {showMobileFolderList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className={`${showMobileFolderList ? 'block' : 'hidden lg:block'} space-y-3 pt-2`}>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => {
                  setActiveCategory('beginner');
                  setSelectedSessionNum(1);
                  setCurrentPuzzleIndex(0);
                  setCurrentMissionIndex(0);
                }}
                className={`py-2 px-2 rounded-xl font-extrabold text-[11px] transition-all ${
                  activeCategory === 'beginner' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
                }`}
              >
                Beginner (48)
              </button>

              <button
                onClick={() => {
                  setActiveCategory('advanced');
                  setSelectedSessionNum(1);
                  setCurrentPuzzleIndex(0);
                  setCurrentMissionIndex(0);
                }}
                className={`py-2 px-2 rounded-xl font-extrabold text-[11px] transition-all ${
                  activeCategory === 'advanced' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
                }`}
              >
                Advanced (36)
              </button>
            </div>

            <div className="space-y-1.5 max-h-[340px] lg:max-h-[520px] overflow-y-auto pr-1">
              {sessionFolders.map((folder) => {
                const isSelected = selectedSessionNum === folder.sessionNumber;
                return (
                  <button
                    key={folder.sessionNumber}
                    onClick={() => {
                      setSelectedSessionNum(folder.sessionNumber);
                      setCurrentPuzzleIndex(0);
                      setCurrentMissionIndex(0);
                      setSolved(false);
                      setShowMobileFolderList(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-bambinos-600 text-white border-bambinos-600 shadow-md font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-bold hover:bg-bambinos-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? <FolderOpen className="w-4 h-4 text-white shrink-0" /> : <Folder className="w-4 h-4 text-bambinos-600 shrink-0" />}
                      <span className="text-xs truncate">{activeCategory === 'beginner' ? 'Session' : 'Adv Session'} {folder.sessionNumber}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {folder.puzzlesCount} Puzzles
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Chessboard Area */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="w-full max-w-[500px] flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700">
            <span className="truncate">{currentPuzzle?.title}</span>
            <span className="px-3 py-1 rounded-full bg-bambinos-100 text-bambinos-800 font-bold text-xs shrink-0">
              {currentPuzzle?.difficulty}
            </span>
          </div>

          <Chessboard
            fen={currentPuzzle?.fen}
            onMove={handleStandardMove}
            annotation={annotation}
            interactive={currentPuzzle?.puzzleType === 'standard' && !solved}
          />
        </div>

        {/* Right Guided Activity / Questions Panel */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          {/* Coach Prompt */}
          <div className="bg-bambinos-50 p-4 rounded-2xl border border-bambinos-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-bambinos-700 font-black">
                <Volume2 className="w-4 h-4" /> Coach Dialogue
              </span>
              <span className="bg-bambinos-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                {activeCategory} • S{selectedSessionNum}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 italic">"{currentPuzzle?.characterPrompt || currentPuzzle?.description}"</p>
          </div>

          {/* Guided Activity MCQ Missions */}
          {currentPuzzle?.puzzleType === 'guided_activity' && currentMission ? (
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-black text-slate-500 border-b border-slate-200 pb-2">
                <span className="uppercase text-bambinos-600">Mission {currentMissionIndex + 1} of {activeMissions.length}</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[10px]">{currentMission.type.toUpperCase()}</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xs sm:text-sm">{currentMission.question}</h4>
                {currentMission.helper && (
                  <p className="text-xs font-medium text-slate-500">{currentMission.helper}</p>
                )}
              </div>

              {/* Choices */}
              <div className="space-y-2">
                {currentMission.choices?.map((choice, idx) => {
                  const isSelected = selectedMcqAnswer === choice;
                  const isCorrect = choice === currentMission.answer;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleMcqSelect(choice)}
                      className={`w-full p-3 rounded-xl font-extrabold text-xs text-left transition-all border flex items-center justify-between ${
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
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-bold text-amber-900 flex items-start gap-2">
                  <QuestionMark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Hint: {currentMission.hint}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="font-bold text-slate-900">Move Solution:</p>
              <p>Drag or click your pieces to execute the winning move solution on the board.</p>
            </div>
          )}

          {/* Victory Card */}
          {solved && (
            <div className="bg-bambinos-50 border-2 border-bambinos-500 p-4 sm:p-5 rounded-2xl space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-bambinos-800 font-black text-base sm:text-lg">
                <CheckCircle className="w-6 h-6 text-bambinos-600" /> Solved! Excellent Work!
              </div>
              <div className="flex justify-center gap-2 sm:gap-3 text-xs font-black">
                <span className="bg-bambinos-200 text-bambinos-900 px-2 py-1 rounded-lg">+40 Rating</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-1 rounded-lg">+5 Speed</span>
                <span className="bg-rose-200 text-rose-900 px-2 py-1 rounded-lg">+5 Streak</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {solved ? (
              <button
                onClick={handleNextPuzzle}
                className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2"
              >
                Next Puzzle in Session <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setHintActive(!hintActive)}
                  className="py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-2xl border border-amber-200 text-xs flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" /> {hintActive ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={handleNextPuzzle}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-300 text-xs"
                >
                  Next Puzzle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
