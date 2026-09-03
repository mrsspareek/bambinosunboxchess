'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Chess } from 'chess.js';
import { Chessboard } from '../../components/Chessboard';
import { getRandomBot, BotProfile, getBotNextMove, evaluateMove } from '../../lib/botEngine';
import { GameHistoryItem, MoveAnnotation } from '../../types/chess';
import { sound } from '../../lib/sound';
import {
  Users,
  Bot,
  RefreshCw,
  Zap,
  Trophy,
  Flame,
  PlayCircle,
  ShieldCheck,
  RotateCcw,
  Flag,
  Link2,
  Copy,
  Check,
  Swords,
  Settings,
  History,
  TrendingUp,
  X,
  Plus,
  Minus,
  Clock,
  Star,
  Award,
  Sparkles,
  Brain,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Search,
  BookOpen,
  ArrowLeft,
  UserPlus,
  Play,
  Pause,
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { LeaderboardModal } from '../../components/LeaderboardModal';
import {
  getUserPointsState,
  UserPointsState,
  addMatchPoints,
  spendMatchPoints,
  getRandomMagnusHint,
  MagnusHint
} from '../../lib/leaderboardStore';

function formatMoveWithPieceNameAndEmoji(moveObj: any) {
  if (!moveObj) return { emoji: '', pieceName: '', notation: '' };

  if (typeof moveObj === 'string') {
    const cleanMove = moveObj.trim();
    if (cleanMove.includes('O-O-O') || cleanMove.includes('o-o-o')) {
      return { emoji: '🏰', pieceName: 'Q-Castle', notation: 'O-O-O' };
    }
    if (cleanMove.includes('O-O') || cleanMove.includes('o-o')) {
      return { emoji: '🏰', pieceName: 'Castle', notation: 'O-O' };
    }
    if (cleanMove.startsWith('K')) return { emoji: '♚', pieceName: 'King', notation: cleanMove };
    if (cleanMove.startsWith('Q')) return { emoji: '♛', pieceName: 'Queen', notation: cleanMove };
    if (cleanMove.startsWith('R')) return { emoji: '♜', pieceName: 'Rook', notation: cleanMove };
    if (cleanMove.startsWith('B')) return { emoji: '♝', pieceName: 'Bishop', notation: cleanMove };
    if (cleanMove.startsWith('N')) return { emoji: '♞', pieceName: 'Knight', notation: cleanMove };
    return { emoji: '♟️', pieceName: 'Pawn', notation: cleanMove };
  }

  const pieceType = moveObj.piece ? moveObj.piece.toLowerCase() : 'p';
  const notation = moveObj.san || `${moveObj.from}-${moveObj.to}`;

  if (notation.includes('O-O-O') || notation.includes('o-o-o')) {
    return { emoji: '🏰', pieceName: 'Q-Castle', notation };
  }
  if (notation.includes('O-O') || notation.includes('o-o')) {
    return { emoji: '🏰', pieceName: 'Castle', notation };
  }

  switch (pieceType) {
    case 'k':
      return { emoji: '♚', pieceName: 'King', notation };
    case 'q':
      return { emoji: '♛', pieceName: 'Queen', notation };
    case 'r':
      return { emoji: '♜', pieceName: 'Rook', notation };
    case 'b':
      return { emoji: '♝', pieceName: 'Bishop', notation };
    case 'n':
      return { emoji: '♞', pieceName: 'Knight', notation };
    case 'p':
    default:
      return { emoji: '♟️', pieceName: 'Pawn', notation };
  }
}

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
    pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3 d6..."
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
    pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6..."
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
    pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4..."
  }
];

function PlayArenaContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams ? searchParams.get('room') : null;

  const [mode, setMode] = useState<'matchmaking' | 'local_2p' | 'friend_link'>(roomId ? 'friend_link' : 'matchmaking');
  const [inGame, setInGame] = useState(true);
  const [opponent, setOpponent] = useState<BotProfile | null>({
    name: 'ThePolackPlayer',
    rating: 889,
    avatar: '/logo.png',
    style: 'tactical',
    openings: []
  });
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [autoFlip, setAutoFlip] = useState(false);

  const [game, setGame] = useState<Chess>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [annotation, setAnnotation] = useState<MoveAnnotation | null>(null);
  const [gameStatus, setGameStatus] = useState<string>('Match Active - Your Turn (White)');
  const [stockfishEval, setStockfishEval] = useState<number>(0.2);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  // Full Screen Mode State & Toggle
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFSChange = () => {
      if (typeof document !== 'undefined' && document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', handleFSChange);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('fullscreenchange', handleFSChange);
      }
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      }
    } else {
      if (typeof document !== 'undefined' && document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    }
  };

  // Right Panel Sub-Tab State ('moves' | 'analysis' | 'info')
  const [activeRightTab, setActiveRightTab] = useState<'moves' | 'analysis' | 'info'>('moves');

  // Clocks (10 minutes each by default)
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);

  // Game Stats, Leaderboard & Points State
  const [gameHistoryList, setGameHistoryList] = useState<GameHistoryItem[]>(INITIAL_MOCK_HISTORY);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userPoints, setUserPoints] = useState({ matchPoints: 450, puzzlePoints: 320, totalPoints: 770, streak: 5 });
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [activeMagnusHint, setActiveMagnusHint] = useState<MagnusHint | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Interactive Game Review Mode States
  const [reviewMode, setReviewMode] = useState<'summary' | 'interactive'>('summary');
  const [reviewStep, setReviewStep] = useState<number>(0);
  const [isReviewAutoplay, setIsReviewAutoplay] = useState<boolean>(false);
  const [showRewardInfoModal, setShowRewardInfoModal] = useState<boolean>(false);

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

  useEffect(() => {
    let interval: any;
    if (isReviewAutoplay && activeRightTab === 'analysis' && reviewMode === 'interactive') {
      interval = setInterval(() => {
        setReviewStep(prev => {
          if (prev >= 9) {
            setIsReviewAutoplay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isReviewAutoplay, activeRightTab, reviewMode]);

  // Load live user points
  useEffect(() => {
    setUserPoints(getUserPointsState());
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (!inGame) return;
    const interval = setInterval(() => {
      const turn = game.turn();
      if (turn === 'w') {
        setWhiteTime(prev => Math.max(0, prev - 1));
      } else {
        setBlackTime(prev => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [inGame, game]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/play?room=unbox-${Math.floor(1000 + Math.random() * 9000)}` : '';

  const handleUseMagnusHint = () => {
    const { success, newState } = spendMatchPoints(20);
    if (success) {
      setUserPoints(newState);
      const hint = getRandomMagnusHint();
      setActiveMagnusHint(hint);
      sound.playMove();
    } else {
      alert('You need at least 20 Match Points to use Magnus Carlsen Brain Hint. Win matches in Play Arena to earn more points!');
    }
  };

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('unbox_game_history');
      if (stored) {
        setGameHistoryList(JSON.parse(stored));
      } else {
        localStorage.setItem('unbox_game_history', JSON.stringify(INITIAL_MOCK_HISTORY));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  useEffect(() => {
    sound.playGameStart();
  }, []);

  // Compute stats
  const totalGamesPlayed = gameHistoryList.length + 19;
  const winsCount = gameHistoryList.filter(g => g.result === 'win').length + 13;
  const lossesCount = gameHistoryList.filter(g => g.result === 'loss').length + 5;
  const drawsCount = Math.max(0, totalGamesPlayed - winsCount - lossesCount);
  const winRatePercentage = Math.round((winsCount / Math.max(1, totalGamesPlayed)) * 100);

  const recordCompletedGame = (result: 'win' | 'loss' | 'draw', opponentName: string, oppRating: number) => {
    const pts = result === 'win' ? 50 : result === 'draw' ? 25 : 10;
    const updatedPoints = addMatchPoints(pts);
    setUserPoints(updatedPoints);

    const newRecord: GameHistoryItem = {
      id: `g-${Date.now()}`,
      date: 'Just Now',
      opponent: opponentName,
      opponentRating: oppRating,
      opponentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      playerRating: 940 + (result === 'win' ? 12 : result === 'loss' ? -10 : 0),
      result,
      accuracy: result === 'win' ? 82.4 : 61.5,
      timeControl: '10:00',
      movesCount: Math.max(1, moveHistory.length),
      isBot: mode === 'matchmaking',
      pgn: moveHistory.join(' ')
    };

    const updated = [newRecord, ...gameHistoryList];
    setGameHistoryList(updated);
    try {
      localStorage.setItem('unbox_game_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save game history', e);
    }
  };

  const handleStartMatchmaking = () => {
    setMode('matchmaking');
    setGameStatus('Searching live queue...');
    sound.playMove();

    setTimeout(() => {
      const bot = getRandomBot();
      setOpponent(bot);
      setInGame(true);
      const newGame = new Chess();
      setGame(newGame);
      setFen(newGame.fen());
      setMoveHistory([]);
      setAnnotation(null);
      setLastMove(null);
      setStockfishEval(0.2);
      setWhiteTime(600);
      setBlackTime(600);
      setActiveRightTab('moves');
      setGameStatus(`Matched vs ${bot.name} (${bot.rating})`);
      sound.playGameStart();
    }, 1200);
  };

  const handleStartLocal2Player = () => {
    setMode('local_2p');
    setOpponent(null);
    setInGame(true);
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setAnnotation(null);
    setLastMove(null);
    setStockfishEval(0.0);
    setWhiteTime(600);
    setBlackTime(600);
    setActiveRightTab('moves');
    setGameStatus('2 Players Mode - White Turn');
    sound.playGameStart();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleResign = () => {
    if (!inGame) return;
    setInGame(false);
    setGameStatus('Resigned. Game Over (Loss)');
    setActiveRightTab('analysis');
    recordCompletedGame('loss', opponent ? opponent.name : 'Opponent', opponent ? opponent.rating : 850);
  };

  const handleUserMove = (from: string, to: string) => {
    if (!inGame) return;

    try {
      const moveEval = evaluateMove(game, from, to);
      setAnnotation(moveEval);
      setFen(game.fen());
      setLastMove({ from, to });
      setMoveHistory(prev => [...prev, `${from}-${to}`]);
      setStockfishEval(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));

      if (game.isGameOver()) {
        setInGame(false);
        const isWin = game.isCheckmate();
        setGameStatus(isWin ? 'Checkmate! You Won! 🏆' : 'Game Over (Draw)');
        setActiveRightTab('analysis');
        sound.playCheck();
        recordCompletedGame(isWin ? 'win' : 'draw', opponent ? opponent.name : 'Opponent', opponent ? opponent.rating : 850);
        return;
      }

      if (mode === 'local_2p') {
        const nextTurn = game.turn() === 'w' ? 'White Turn' : 'Black Turn';
        setGameStatus(`2 Players Mode - ${nextTurn}`);
        if (autoFlip) {
          setBoardOrientation(game.turn() === 'w' ? 'white' : 'black');
        }
      } else if (mode === 'matchmaking' && opponent) {
        setGameStatus(`${opponent.name} is thinking...`);
        setTimeout(() => {
          const botMove = getBotNextMove(game.fen(), opponent);
          if (botMove) {
            const pieceOnTarget = game.get(botMove.to as any);
            const botEval = evaluateMove(game, botMove.from, botMove.to);
            setAnnotation(botEval);
            setFen(game.fen());
            setLastMove({ from: botMove.from, to: botMove.to });
            setMoveHistory(prev => [...prev, `${botMove.from}-${botMove.to}`]);
            setStockfishEval(prev => +(prev + (Math.random() * 0.8 - 0.5)).toFixed(1));

            if (pieceOnTarget) {
              sound.playCapture();
            } else {
              sound.playMove();
            }

            if (game.isGameOver()) {
              setInGame(false);
              const isOpponentWin = game.isCheckmate();
              setGameStatus(isOpponentWin ? 'Defeat! Opponent delivered checkmate.' : 'Game Over (Draw)');
              setActiveRightTab('analysis');
              sound.playCheck();
              recordCompletedGame(isOpponentWin ? 'loss' : 'draw', opponent.name, opponent.rating);
            } else {
              setGameStatus('Your Turn (White)');
            }
          }
        }, 700);
      }
    } catch (err) {
      console.error('Invalid move attempted:', err);
    }
  };

  // Group moves into pairs using verbose chess.js history for 100% accurate piece detection
  const fullVerboseHistory = game.history({ verbose: true });
  const formattedMoves: { index: number; white: any; black?: any }[] = [];

  if (fullVerboseHistory.length > 0) {
    for (let i = 0; i < fullVerboseHistory.length; i += 2) {
      formattedMoves.push({
        index: Math.floor(i / 2) + 1,
        white: fullVerboseHistory[i],
        black: fullVerboseHistory[i + 1]
      });
    }
  } else {
    for (let i = 0; i < moveHistory.length; i += 2) {
      formattedMoves.push({
        index: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1]
      });
    }
  }

  return (
    <div className={`h-screen max-h-screen overflow-hidden bg-slate-50 text-slate-900 p-2 sm:p-3 mx-auto flex flex-col justify-between font-sans transition-all ${
      isFullScreen ? 'max-w-[1700px]' : 'max-w-[1500px]'
    }`}>
      {/* Top Back Navigation Tab */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-black border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-bambinos-600" />
          <span>← Back</span>
        </Link>
      </div>


      {/* ========================================================================= */}
      {/* MAIN ARENA LAYOUT: LEFT SIDE CHESSBOARD + RIGHT SIDE CHESS.COM PANEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: OPPONENT PLAYER BAR + CHESSBOARD + USER PLAYER BAR */}
        {/* ======================================================================= */}
        <div className={`space-y-3 flex flex-col items-center transition-all ${
          isFullScreen ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-7 xl:col-span-8'
        }`}>
          {/* Opponent Player Card */}
          <div className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 shadow-sm shrink-0">
                <img
                  src={mode === 'local_2p' ? '/logo2.png' : opponent ? opponent.avatar : '/pieces/cburnett/bQ.svg'}
                  alt="Opponent Avatar"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {mode === 'local_2p' ? 'Player 2 (Black)' : opponent ? opponent.name : 'Searching...'}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    ({mode === 'local_2p' ? '1000' : opponent ? opponent.rating : '889'})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                  <span className="text-amber-600 font-black">+3 ♙♞</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-black">{gameStatus}</span>
                </div>
              </div>
            </div>

            {/* Opponent Timer Clock */}
            <div className={`px-4 py-2 rounded-xl font-mono text-base font-black shadow-sm border transition-all ${
              game.turn() === 'b' && inGame 
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(blackTime)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chessboard Container */}
          <div className={`w-full flex justify-center bg-white rounded-3xl border border-slate-200 shadow-sm relative transition-all ${
            isFullScreen ? 'p-3 sm:p-6 shadow-2xl border-amber-300/80 ring-4 ring-amber-400/20' : 'p-2 sm:p-4'
          }`}>
            {/* Corner Fullscreen Tab Button */}
            <button
              onClick={toggleFullScreen}
              className="absolute top-3 right-3 z-30 bg-slate-900/90 hover:bg-slate-900 text-white px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-lg transition-all active:scale-95 flex items-center gap-1.5 text-xs font-black"
              title="Open Full Screen Mode"
            >
              <Maximize2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Full Screen</span>
            </button>

            <Chessboard
              fen={fen}
              onMove={handleUserMove}
              annotation={annotation}
              interactive={inGame}
              showEvalBar={true}
              evaluation={stockfishEval}
              orientation={boardOrientation}
              lastMove={lastMove}
              size="full"
            />
          </div>

          {/* User Player Card */}
          <div className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-amber-400 flex items-center justify-center p-1 shadow-sm shrink-0">
                <img
                  src="/pieces/cburnett/wK.svg"
                  alt="User King DP"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">Zaid Iqbal</span>
                  <span className="text-xs text-slate-500 font-bold">(940)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                  <span className="text-emerald-700 font-black">+1 ♟</span>
                  <span>•</span>
                  <span className="text-bambinos-700 font-black">Your Turn (White)</span>
                </div>
              </div>
            </div>

            {/* User Timer Clock */}
            <div className={`px-4 py-2 rounded-xl font-mono text-base font-black shadow-sm border transition-all ${
              game.turn() === 'w' && inGame 
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(whiteTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: CHESS.COM STYLE SIDE PANEL (LIGHT THEME) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-xl space-y-4 flex flex-col justify-between min-h-[580px]">
          
          {/* Top Panel Action Bar: Quick Play, Magnus Hint */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartMatchmaking}
                  className="px-3.5 py-2 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" /> Play Match
                </button>
                <button
                  onClick={handleStartLocal2Player}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm"
                >
                  + New Game
                </button>
              </div>

              <button
                onClick={handleUseMagnusHint}
                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 transition-all active:scale-95"
                title="Spend 20 Match Points to get Magnus Carlsen tactical hint"
              >
                <Brain className="w-3.5 h-3.5 text-slate-950" />
                <span>Magnus Hint (-20)</span>
              </button>
            </div>

            {/* Sub-Tab Navigation Header */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-black">
              <button
                onClick={() => setActiveRightTab('moves')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeRightTab === 'moves' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Moves ({moveHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveRightTab('analysis')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeRightTab === 'analysis' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Game Analysis</span>
              </button>

              <button
                onClick={() => setActiveRightTab('info')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeRightTab === 'info' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Info</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: MOVES NOTATION LIST (LIGHT THEME) */}
          {/* ========================================================================= */}
          {activeRightTab === 'moves' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 my-2">
              {/* Opening Banner */}
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="font-extrabold text-amber-700 flex items-center gap-1">
                  📖 Italian Game: Two Knights Defense
                </span>
                <span className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">ECO: C55</span>
              </div>

              {/* Moves List Scroll Table */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex-1 min-h-[260px] max-h-[320px] overflow-y-auto space-y-1 font-mono text-xs">
                {formattedMoves.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                    <Swords className="w-8 h-8 text-slate-400 animate-bounce" />
                    <p className="font-extrabold text-xs text-slate-700">Match Initialized!</p>
                    <p className="text-[11px] text-slate-500">Make your first move on the board to record moves.</p>
                  </div>
                ) : (
                  formattedMoves.map((row) => {
                    const whiteParsed = formatMoveWithPieceNameAndEmoji(row.white);
                    const blackParsed = formatMoveWithPieceNameAndEmoji(row.black);

                    return (
                      <div
                        key={row.index}
                        className="grid grid-cols-12 gap-1.5 px-2.5 py-2 rounded-xl hover:bg-slate-200/70 transition-colors items-center border border-transparent hover:border-slate-300"
                      >
                        {/* Move Number */}
                        <span className="col-span-2 text-slate-400 font-black text-[11px]">
                          {row.index}.
                        </span>

                        {/* White Move (Piece Emoji + Name + Move) */}
                        <span className="col-span-5 text-slate-900 font-extrabold flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 truncate">
                            <span className="text-xs shrink-0">{whiteParsed.emoji}</span>
                            <span className="text-[9px] text-amber-800 font-black bg-amber-100 px-1 py-0.2 rounded shrink-0">
                              {whiteParsed.pieceName}
                            </span>
                            <span className="font-mono text-slate-900 font-bold truncate">{whiteParsed.notation}</span>
                          </span>
                          {row.index === 1 && (
                            <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 rounded border border-emerald-300 font-black shrink-0">
                              Best
                            </span>
                          )}
                        </span>

                        {/* Black Move (Piece Emoji + Name + Move) */}
                        <span className="col-span-5 text-slate-800 font-extrabold flex items-center justify-between text-[11px]">
                          {row.black ? (
                            <span className="flex items-center gap-1 truncate">
                              <span className="text-xs shrink-0">{blackParsed.emoji}</span>
                              <span className="text-[9px] text-slate-700 font-black bg-slate-200 px-1 py-0.2 rounded shrink-0">
                                {blackParsed.pieceName}
                              </span>
                              <span className="font-mono text-slate-900 font-bold truncate">{blackParsed.notation}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                          {row.black && row.index === 2 && (
                            <span className="text-[9px] px-1 bg-amber-100 text-amber-800 rounded border border-amber-300 font-black shrink-0">
                              Good
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Match Stakes Banner */}
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center text-xs space-y-1">
                <div className="font-black text-slate-900">
                  Zaid Iqbal (940) vs. {opponent ? opponent.name : 'Opponent'} ({opponent ? opponent.rating : 889})
                </div>
                <div className="text-[11px] font-bold text-slate-600">
                  10 min • Rated • <span className="text-emerald-700 font-black">Win +16</span> / <span className="text-amber-700 font-black">Draw +2</span> / <span className="text-rose-700 font-black">Loss -12</span>
                </div>
              </div>

              {/* Match Stepper & Control Navigation Buttons */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  <button title="First Move" className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button title="Previous Move" className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button title="Next Move" className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button title="Last Move" className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => alert('Offer draw sent to opponent.')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-1"
                  >
                    ½ Draw
                  </button>
                  <button
                    onClick={handleResign}
                    className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 shadow-sm flex items-center justify-center gap-1"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-600" /> Resign
                  </button>
                  <button
                    onClick={() => setBoardOrientation(prev => prev === 'white' ? 'black' : 'white')}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-bambinos-600" /> Flip
                  </button>
                  <button
                    onClick={toggleFullScreen}
                    className="py-2 bg-gradient-to-r from-bambinos-600 to-indigo-600 hover:from-bambinos-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="Open Full Screen Mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GAME REVIEW MODE (LIGHT THEME CHESS.COM GAME REVIEW) */}
          {/* ========================================================================= */}
          {activeRightTab === 'analysis' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 my-2">
              {/* MODE 1: "START REVIEW" OVERVIEW SCREEN (LIGHT THEME) */}
              {reviewMode === 'summary' ? (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                          ⭐
                        </div>
                        <h3 className="text-sm font-black text-slate-900">Game Review Summary</h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                        Stockfish 16 Active
                      </span>
                    </div>

                    {/* Move Quality Classification Comparison Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-2.5 space-y-1.5 text-xs font-mono shadow-sm">
                      <div className="grid grid-cols-12 gap-1 text-[11px] font-black text-slate-500 border-b border-slate-200 pb-1.5 px-2 text-center">
                      <span className="col-span-3 text-left">{userName || 'Player'} (White)</span>
                        <span className="col-span-6">Category</span>
                        <span className="col-span-3 text-right">Opponent</span>
                      </div>

                      {[
                        { name: 'Brilliant', white: 0, black: 0, icon: '!!', color: 'text-cyan-600 font-black' },
                        { name: 'Great', white: 2, black: 0, icon: '!', color: 'text-blue-600 font-black' },
                        { name: 'Book', white: 1, black: 1, icon: '📖', color: 'text-amber-700 font-black' },
                        { name: 'Best', white: 3, black: 2, icon: '⭐', color: 'text-emerald-700 font-black' },
                        { name: 'Excellent', white: 1, black: 1, icon: '👍', color: 'text-green-700 font-black' },
                        { name: 'Good', white: 0, black: 1, icon: '✅', color: 'text-slate-700 font-bold' },
                        { name: 'Inaccuracy', white: 0, black: 1, icon: '⁉️', color: 'text-amber-600 font-black' },
                        { name: 'Mistake', white: 0, black: 0, icon: '❓', color: 'text-orange-600 font-black' },
                        { name: 'Miss', white: 0, black: 0, icon: '❌', color: 'text-rose-600 font-black' },
                        { name: 'Blunder', white: 1, black: 1, icon: '‼️', color: 'text-rose-700 font-black' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors items-center text-center text-xs"
                        >
                          <span className="col-span-3 text-left font-black text-emerald-700">{item.white}</span>
                          <span className="col-span-6 flex items-center justify-center gap-1.5 font-sans font-bold text-slate-800">
                            <span className={item.color}>{item.icon}</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="col-span-3 text-right font-black text-slate-700">{item.black}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Green "Start Review" Button */}
                  <button
                    onClick={() => {
                      setReviewMode('interactive');
                      setReviewStep(0);
                      sound.playMove();
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-center mt-3"
                  >
                    <Play className="w-5 h-5 fill-white" /> Start Interactive Review
                  </button>
                </div>
              ) : (
                /* MODE 2: INTERACTIVE GAME REVIEW STEPPER (LIGHT THEME) */
                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <button
                        onClick={() => setReviewMode('summary')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Summary
                      </button>
                      <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                        ⭐ Game Review • Step {reviewStep + 1} of {10}
                      </span>
                    </div>

                    {/* COACH SPEECH CARD (LIGHT THEME) */}
                    <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-start gap-3 shadow-md">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 p-1 shrink-0 flex items-center justify-center text-2xl">
                        🧑‍🏫
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-black border ${
                            reviewStep === 8 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {reviewStep === 8 ? '‼️ Blunder' : reviewStep === 0 ? '📖 Book' : '⭐ Best'}
                          </span>

                          <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded text-xs font-mono font-black border border-slate-200">
                            {reviewStep === 8 ? '+3.40' : '-1.31'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {reviewStep === 0 && "g4 opens space on the kingside and seeks aggressive early pawn control."}
                          {reviewStep === 1 && "d5 takes space in the center and attacks the g4 pawn with the light-squared bishop."}
                          {reviewStep === 2 && "g5 advances the pawn, dislodging Black’s knight from its favorite f6 square."}
                          {reviewStep === 3 && "e5 strikes at the center, preparing quick kingside development."}
                          {reviewStep === 4 && "This move activates your bishop to strengthen control over the center."}
                          {reviewStep === 5 && "Captures the undefended g5 pawn with tempo on White’s kingside."}
                          {reviewStep === 6 && "Recaptures the central pawn, opening the long diagonal towards Black’s rook."}
                          {reviewStep === 7 && "Develops a knight toward the center while defending against pawn threats."}
                          {reviewStep === 8 && "A critical blunder! Gives away a full bishop without sufficient tactical compensation."}
                          {reviewStep === 9 && "Recaptures White’s bishop, taking a decisive material advantage."}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => alert('Coach explanation: Best move is to castle and secure king safety before attacking.')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] rounded-lg border border-slate-200 flex items-center gap-1 shadow-sm"
                          >
                            💡 Explain
                          </button>

                          <button
                            onClick={() => {
                              if (reviewStep < 9) setReviewStep(prev => prev + 1);
                            }}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg shadow flex items-center gap-1 ml-auto"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MINI MOVE LIST TABLE WITH BADGES */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-2 max-h-[160px] overflow-y-auto font-mono text-xs space-y-1 shadow-sm">
                      {[
                        { w: 'g4 📖', b: 'd5 📖' },
                        { w: 'g5 ⭐', b: 'e5 🎯' },
                        { w: 'Bg2 ⭐', b: 'Bxg5 🎯' },
                        { w: 'Bxd5 ⭐', b: 'Nf6 👍' },
                        { w: 'Bxf7+ ‼️', b: 'Kxf7 ⭐' }
                      ].map((row, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-12 gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                            Math.floor(reviewStep / 2) === idx ? 'bg-slate-100 border border-slate-300 font-bold' : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setReviewStep(idx * 2)}
                        >
                          <span className="col-span-2 text-slate-400 font-bold">{idx + 1}.</span>
                          <span className="col-span-5 text-emerald-700 font-black">{row.w}</span>
                          <span className="col-span-5 text-slate-800 font-black">{row.b}</span>
                        </div>
                      ))}
                    </div>

                    {/* EVALUATION TIMELINE CHART (LIGHT THEME SVG GRAPH) */}
                    <div className="bg-white border border-slate-200 p-2.5 rounded-2xl space-y-1 shadow-sm">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Evaluation Graph</span>
                      <div className="h-16 w-full bg-slate-100 rounded-xl overflow-hidden relative flex items-center border border-slate-200">
                        {/* SVG Curve */}
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path
                            d="M 0,20 Q 20,28 40,15 T 70,35 T 100,10"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2"
                          />
                          <circle cx="20" cy="28" r="2.5" fill="#d97706" />
                          <circle cx="70" cy="35" r="3" fill="#dc2626" />
                          <circle cx="100" cy="10" r="2.5" fill="#059669" />
                        </svg>

                        {/* Active Step Pointer Line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 transition-all duration-300"
                          style={{ left: `${(reviewStep / 9) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM REVIEW STEPPER CONTROL BAR */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-5 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setReviewStep(0)}
                        title="First Move"
                        className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setReviewStep(prev => Math.max(0, prev - 1))}
                        title="Previous Move"
                        className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsReviewAutoplay(prev => !prev)}
                        title="Autoplay"
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-sm"
                      >
                        {isReviewAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <button
                        onClick={() => setReviewStep(prev => Math.min(9, prev + 1))}
                        title="Next Move"
                        className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setReviewStep(9)}
                        title="Last Move"
                        className="py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => alert('Review report shared!')}
                        className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>

                      <button
                        onClick={() => setReviewMode('summary')}
                        className="py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" /> Full Summary
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: GAME INFO & STRATEGY TIPS (LIGHT THEME) */}
          {/* ========================================================================= */}
          {activeRightTab === 'info' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 my-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-black text-indigo-700 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" /> Opponent Strategy Info
                </div>

                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-bold">Opponent:</span>
                    <span className="font-black text-slate-900">{opponent ? opponent.name : 'Bot AI'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-bold">Playing Style:</span>
                    <span className="font-black text-amber-700 uppercase">{opponent ? opponent.style : 'Tactical'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-bold">Preferred Openings:</span>
                    <span className="font-bold text-slate-800">Italian Game & Scholar</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-[11px] space-y-1">
                  <span className="font-black text-emerald-700 block">💡 Magnus Strategy Tip</span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Do not trade off your active Bishop for a passive Knight in the opening. Maintain central pawn control!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Magnus Hint Active Modal */}
          {activeMagnusHint && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl space-y-2 text-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-amber-800">
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4" /> {activeMagnusHint.title}
                </span>
                <button
                  onClick={() => setActiveMagnusHint(null)}
                  className="text-slate-500 hover:text-slate-900 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-700 italic font-medium">"{activeMagnusHint.quote}"</p>
              <div className="text-xs font-bold text-amber-900 bg-amber-100 p-2 rounded-xl border border-amber-300">
                💡 <span className="underline">Recommended Tactics:</span> {activeMagnusHint.keyTactics}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        defaultTab="match"
      />

      {/* History Modal (Light Theme) */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-bambinos-600" /> Match History Log
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {gameHistoryList.map((item) => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white ${item.result === 'win' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                      {item.result === 'win' ? '+' : '-'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{item.opponent} ({item.opponentRating})</div>
                      <div className="text-slate-500 text-[11px]">{item.date} • {item.movesCount} moves</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700">{item.accuracy}% Accuracy</div>
                    <div className="text-slate-500 font-bold uppercase text-[10px]">{item.result}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PlayArenaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-bambinos-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-extrabold text-sm text-slate-700">Loading Play Arena...</p>
        </div>
      </div>
    }>
      <PlayArenaContent />
    </Suspense>
  );
}
