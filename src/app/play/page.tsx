'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Chess } from 'chess.js';
import { Chessboard } from '../../components/Chessboard';
import { getRandomBot, BotProfile, getBotNextMove, evaluateMove } from '../../lib/botEngine';
import { MoveAnnotation } from '../../types/chess';
import { sound } from '../../lib/sound';
import { Users, Bot, RefreshCw, Zap, Trophy, Flame, PlayCircle, ShieldCheck, RotateCcw, Flag, Link2, Copy, Check, Swords, Settings } from 'lucide-react';

function PlayArenaContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams ? searchParams.get('room') : null;

  const [mode, setMode] = useState<'matchmaking' | 'local_2p' | 'friend_link'>(roomId ? 'friend_link' : 'matchmaking');
  const [inGame, setInGame] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1420);
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
  const [copiedLink, setCopiedLink] = useState(false);

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}/play?room=unbox-${Math.floor(1000 + Math.random() * 9000)}` : '';

  useEffect(() => {
    sound.playGameStart();
  }, []);

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
    setGameStatus('2 Players Mode - White Turn');
    sound.playGameStart();
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
      setLastMove({ from, to });
      setMoveHistory(prev => [...prev, `${from}-${to}`]);
      setStockfishEval(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));

      if (game.isGameOver()) {
        setInGame(false);
        setGameStatus(game.isCheckmate() ? 'Checkmate! Game Over!' : 'Game Over (Draw)');
        sound.playCheck();
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
              setGameStatus(game.isCheckmate() ? 'Defeat! Opponent delivered checkmate.' : 'Game Over (Draw)');
              sound.playCheck();
            } else {
              setGameStatus('Your Turn (White)');
            }
          }
        }, 700);
      }
    } catch (e) {
      console.log('Illegal move attempted');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 sm:p-6 max-w-md md:max-w-4xl mx-auto space-y-4 pb-24">
      {/* Top Bar Mode Switcher & Invite Link */}
      <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartMatchmaking}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              mode === 'matchmaking' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400'
            }`}
          >
            Play Online / AI
          </button>
          <button
            onClick={handleStartLocal2Player}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
              mode === 'local_2p' ? 'bg-bambinos-600 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> 2 Players
          </button>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-xl font-extrabold flex items-center gap-1 border border-slate-700"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedLink ? 'Copied' : 'Invite Link'}
        </button>
      </div>

      {/* Opponent Player Card */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-bambinos-900 border-2 border-bambinos-500 overflow-hidden font-black text-white flex items-center justify-center text-sm shadow-md">
            {mode === 'local_2p' ? 'P2' : opponent ? '🇵🇱' : '🤖'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white">
                {mode === 'local_2p' ? 'Player 2 (Black)' : opponent ? opponent.name : 'Searching Queue...'}
              </span>
              <span className="text-xs">🇵🇱</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>{mode === 'local_2p' ? 'Local 2 Players' : opponent ? `(${opponent.rating})` : 'Bot Active'}</span>
              <span className="text-amber-400 font-extrabold">+3 ♙♞</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black text-slate-200">
          10:00
        </div>
      </div>

      {/* Horizontal Move Notation Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2 text-xs font-mono overflow-x-auto whitespace-nowrap">
        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider shrink-0">Moves:</span>
        {moveHistory.length === 0 ? (
          <span className="text-slate-500 font-medium">Match initialized. Make your move!</span>
        ) : (
          moveHistory.map((m, idx) => (
            <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-extrabold">
              {idx + 1}. {m}
            </span>
          ))
        )}
      </div>

      {/* Main Interactive Chessboard */}
      <div className="flex justify-center my-2">
        <Chessboard
          fen={fen}
          onMove={handleUserMove}
          annotation={annotation}
          interactive={inGame}
          showEvalBar={true}
          evaluation={stockfishEval}
          orientation={boardOrientation}
          lastMove={lastMove}
        />
      </div>

      {/* User Player Card */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-[#center] gap-3">
          <div className="w-11 h-11 rounded-2xl bg-bambinos-600 border-2 border-bambinos-400 font-black text-white flex items-center justify-center text-sm shadow-md">
            ZI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white">
                {mode === 'local_2p' ? 'Player 1 (White)' : 'Zaid Iqbal (You)'}
              </span>
              <span className="text-xs">🇵🇸</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="text-emerald-400 font-extrabold">(879)</span>
              <span className="flex items-center gap-0.5 text-amber-400">
                <Flame className="w-3 h-3 fill-amber-400" /> 4 Streak
              </span>
            </div>
          </div>
        </div>

        <div className="bg-bambinos-950 border border-bambinos-800 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black text-bambinos-300">
          10:00
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-around text-xs font-extrabold text-slate-300">
        <button
          onClick={() => setInGame(false)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
        >
          <Flag className="w-4 h-4 text-rose-500" /> Resign
        </button>

        <button
          onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" /> Flip Board
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors">
          <Settings className="w-4 h-4 text-slate-400" /> Options
        </button>
      </div>
    </div>
  );
}

export default function PlayArenaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-black text-emerald-400">Loading Play Arena...</div>}>
      <PlayArenaContent />
    </Suspense>
  );
}
