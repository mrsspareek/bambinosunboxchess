'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Chess } from 'chess.js';
import { Chessboard } from '../../components/Chessboard';
import { getRandomBot, BotProfile, getBotNextMove, evaluateMove } from '../../lib/botEngine';
import { MoveAnnotation } from '../../types/chess';
import { Users, Bot, RefreshCw, Zap, Trophy, Flame, PlayCircle, ShieldCheck, RotateCcw, Flag, Link2, Copy, Check, Swords } from 'lucide-react';

function PlayArenaContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams ? searchParams.get('room') : null;

  const [mode, setMode] = useState<'matchmaking' | 'local_2p' | 'friend_link'>(roomId ? 'friend_link' : 'matchmaking');
  const [inGame, setInGame] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1420);
  const [opponent, setOpponent] = useState<BotProfile | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [autoFlip, setAutoFlip] = useState(false);

  const [game, setGame] = useState<Chess>(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [annotation, setAnnotation] = useState<MoveAnnotation | null>(null);
  const [gameStatus, setGameStatus] = useState<string>('Ready for Match');
  const [isSearching, setIsSearching] = useState(false);
  const [stockfishEval, setStockfishEval] = useState<number>(0.2);
  const [copiedLink, setCopiedLink] = useState(false);

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/play?room=unbox-${Math.floor(1000 + Math.random() * 9000)}` : '';

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMatchmaking = () => {
    setMode('matchmaking');
    setIsSearching(true);
    setGameStatus('Searching live queue...');

    setTimeout(() => {
      const bot = getRandomBot();
      setOpponent(bot);
      setIsSearching(false);
      setInGame(true);
      const newGame = new Chess();
      setGame(newGame);
      setFen(newGame.fen());
      setMoveHistory([]);
      setAnnotation(null);
      setStockfishEval(0.2);
      setBoardOrientation('white');
      setGameStatus(`Matched vs ${bot.name} (${bot.rating})`);
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
    setStockfishEval(0.0);
    setBoardOrientation('white');
    setGameStatus('2 Players (Pass & Play) - White Turn');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(challengeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleUserMove = (from: string, to: string) => {
    if (!inGame) return;

    try {
      const moveEval = evaluateMove(game, from, to);
      setAnnotation(moveEval);
      setFen(game.fen());
      setMoveHistory(prev => [...prev, `${from}-${to}`]);
      setStockfishEval(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));

      if (game.isGameOver()) {
        setInGame(false);
        setGameStatus(game.isCheckmate() ? 'Checkmate! Game Over!' : 'Game Over (Draw)');
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
            const botEval = evaluateMove(game, botMove.from, botMove.to);
            setAnnotation(botEval);
            setFen(game.fen());
            setMoveHistory(prev => [...prev, `${botMove.from}-${botMove.to}`]);
            setStockfishEval(prev => +(prev + (Math.random() * 0.8 - 0.5)).toFixed(1));

            if (game.isGameOver()) {
              setInGame(false);
              setGameStatus(game.isCheckmate() ? 'Defeat! Opponent delivered checkmate.' : 'Game Over (Draw)');
            } else {
              setGameStatus('Your Turn');
            }
          }
        }, 700);
      }
    } catch (e) {
      console.log('Illegal move attempted');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-bambinos-600 p-1 flex items-center justify-center shadow-md">
            <Image src="/logo.png" alt="Bambinos Logo" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Live Play Arena</h1>
            <p className="text-xs font-semibold text-bambinos-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              {onlineCount.toLocaleString()} Players Online
            </p>
          </div>
        </div>

        {/* 2-Player Game Mode Selectors */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={handleStartMatchmaking}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              mode === 'matchmaking' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Play Online / AI
          </button>
          <button
            onClick={handleStartLocal2Player}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
              mode === 'local_2p' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> 2 Players (Pass & Play)
          </button>
        </div>
      </div>

      {/* Challenge Friend Link Box */}
      <div className="bg-bambinos-50 border border-bambinos-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-bold text-bambinos-900">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-bambinos-600 shrink-0" />
          <span>Challenge a Friend (2 Players Link): Share your unique link with a friend to play together!</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="py-2 px-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
        >
          {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedLink ? 'Link Copied!' : 'Copy Invite Link'}
        </button>
      </div>

      {/* Main Play Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Board Area */}
        <div className="lg:col-span-2 flex flex-col items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          {/* Opponent / Player 2 Card */}
          <div className="w-full max-w-[540px] flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bambinos-100 border-2 border-bambinos-600 overflow-hidden flex items-center justify-center font-black text-bambinos-800">
                {mode === 'local_2p' ? (
                  'P2'
                ) : opponent ? (
                  <img src={opponent.avatar} alt={opponent.name} className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-5 h-5 text-bambinos-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  {mode === 'local_2p' ? 'Player 2 (Black)' : opponent ? opponent.name : 'Searching Queue...'}
                </p>
                <span className="text-xs font-bold text-bambinos-600">
                  {mode === 'local_2p' ? 'Local 2 Players' : opponent ? `Rating: ${opponent.rating}` : 'Bot Fallback Active'}
                </span>
              </div>
            </div>
            <div className="bg-slate-200 px-3.5 py-1 rounded-xl font-mono text-sm font-black text-slate-700">10:00</div>
          </div>

          {/* Interactive Board */}
          <Chessboard fen={fen} onMove={handleUserMove} annotation={annotation} interactive={inGame} showEvalBar={true} evaluation={stockfishEval} orientation={boardOrientation} />

          {/* Player 1 (White) Card */}
          <div className="w-full max-w-[540px] flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bambinos-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                P1
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  {mode === 'local_2p' ? 'Player 1 (White)' : 'Zaid Iqbal (You)'}
                </p>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4 Wins Streak
                </span>
              </div>
            </div>
            <div className="bg-bambinos-100 px-3.5 py-1 rounded-xl font-mono text-sm font-black text-bambinos-700">10:00</div>
          </div>
        </div>

        {/* Live Notation & Controls Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Match Status</span>
            <div className="p-3.5 rounded-2xl bg-bambinos-50 border border-bambinos-200 text-sm font-extrabold text-bambinos-900">
              {gameStatus}
            </div>
          </div>

          {/* Auto Flip Board Toggle for 2 Players */}
          {mode === 'local_2p' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold">
              <span>Auto-Flip Board on Turn:</span>
              <button
                onClick={() => setAutoFlip(!autoFlip)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  autoFlip ? 'bg-bambinos-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {autoFlip ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* Algebraic Move History Log */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Notation History</span>
            <div className="h-52 overflow-y-auto bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-1.5 font-mono text-xs">
              {moveHistory.length === 0 ? (
                <div className="text-slate-400 text-center py-16 font-sans">No moves played yet. Start 2 Players game!</div>
              ) : (
                moveHistory.map((m, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-400 font-bold">#{idx + 1}</span>
                    <span className="font-black text-slate-800">{m}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInGame(false)}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl border border-rose-200 text-xs flex items-center justify-center gap-1.5"
            >
              <Flag className="w-4 h-4" /> End Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayArenaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-black text-bambinos-600">Loading 2-Player Arena...</div>}>
      <PlayArenaContent />
    </Suspense>
  );
}
