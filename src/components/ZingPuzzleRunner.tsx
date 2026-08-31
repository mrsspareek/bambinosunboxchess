'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock3, ExternalLink, HelpCircle, ShieldCheck, Target, Trophy } from 'lucide-react';
import { LessonChessboard } from './LessonChessboard';
import { MoveAnnotation } from '../types/chess';
import { ZingAttempt, ZingLaunchRecord, ZingPuzzleDefinition } from '../types/zing';

interface Props {
  puzzle: ZingPuzzleDefinition;
  launch: ZingLaunchRecord;
  launchToken: string;
}

export function ZingPuzzleRunner({ puzzle, launch, launchToken }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintedSteps, setHintedSteps] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [annotation, setAnnotation] = useState<MoveAnnotation | null>(null);
  const [attempt, setAttempt] = useState<ZingAttempt | null>(null);
  const [saveState, setSaveState] = useState<'ready' | 'saving' | 'error'>('ready');
  const startedAt = useRef(Date.now());
  const submitting = useRef(false);

  const step = puzzle.steps[stepIndex];
  const hintUsed = step ? hintedSteps.includes(step.id) : false;
  const progress = attempt ? 100 : Math.round((stepIndex / puzzle.steps.length) * 100);

  useEffect(() => {
    void fetch('/api/integrations/zing/attempts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ launchToken, event: 'started' }),
      keepalive: true
    });
  }, [launchToken]);

  const saveCompletion = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setSaveState('saving');
    try {
      const response = await fetch('/api/integrations/zing/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          launchToken,
          event: 'completed',
          mistakes,
          hintsUsed: hintedSteps.length,
          durationSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
        })
      });
      const data = (await response.json()) as { attempt?: ZingAttempt; error?: string };
      if (!response.ok || !data.attempt) throw new Error(data.error || 'Unable to save result.');
      setAttempt(data.attempt);
    } catch {
      submitting.current = false;
      setSaveState('error');
    }
  };

  const evaluate = (answer: string, destination: string) => {
    if (!step || saveState === 'saving') return;
    if (answer.toLowerCase() !== step.answer.toLowerCase()) {
      setMistakes((value) => value + 1);
      setAnnotation({ type: 'blunder', symbol: '??', label: 'Try again', square: destination });
      setFeedback('Almost—read the file letter first, then the rank number, and try again.');
      return;
    }

    setAnnotation({ type: 'brilliant', symbol: '!!', label: 'Correct', square: destination });
    setFeedback(step.successMessage);
    if (stepIndex === puzzle.steps.length - 1) {
      void saveCompletion();
    } else {
      setTimeout(() => {
        setStepIndex((value) => value + 1);
        setFeedback('');
        setAnnotation(null);
      }, 650);
    }
  };

  const showHint = () => {
    if (!step || hintUsed) return;
    setHintedSteps((items) => [...items, step.id]);
    setFeedback(`Hint: look for square ${step.answer}.`);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bambinos-600 text-lg font-black text-white">b</div>
            <div><div className="text-sm font-black">Unbox Chess</div><div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Secure Zing activity</div></div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">{launch.studentName} · {launch.assignmentId}</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-bambinos-600 transition-all" style={{ width: `${progress}%` }} /></div>

        {!attempt ? (
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5"><div className="text-xs font-black uppercase tracking-widest text-bambinos-600">Lesson {puzzle.lessonNumber} · {puzzle.lessonTitle}</div><h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{puzzle.title}</h1></div>
              <div className="mx-auto max-w-[600px]"><LessonChessboard fen={puzzle.fen} orientation={puzzle.orientation} mode={puzzle.mode === 'square_sequence' ? 'squares' : 'moves'} onAnswer={evaluate} annotation={annotation} highlightedSquare={hintUsed ? step?.answer : null} interactive={saveState !== 'saving'} /></div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between text-xs font-black text-slate-500"><span>QUESTION {stepIndex + 1} OF {puzzle.steps.length}</span><span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> ~{puzzle.estimatedMinutes} min</span></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-bambinos-50 text-bambinos-600"><Target className="h-7 w-7" /></div>
                <h2 className="text-xl font-black text-slate-900">{step?.prompt}</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{puzzle.coachPrompt}</p>
                {feedback && <div className={`mt-5 rounded-2xl border p-4 text-sm font-bold ${annotation?.type === 'blunder' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{feedback}</div>}
                {saveState === 'saving' && <div className="mt-4 rounded-2xl bg-bambinos-50 p-4 text-sm font-bold text-bambinos-700">Saving your result…</div>}
                {saveState === 'error' && <button onClick={() => void saveCompletion()} className="mt-4 w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white">Result not saved—try again</button>}
                <button onClick={showHint} disabled={hintUsed || saveState === 'saving'} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-800 disabled:opacity-50"><HelpCircle className="h-4 w-4" /> {hintUsed ? 'Hint used' : 'Show a hint'}</button>
              </div>
              <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200 bg-white p-4 text-center"><div className="text-2xl font-black">{mistakes}</div><div className="text-[10px] font-black uppercase text-slate-400">Mistakes</div></div><div className="rounded-2xl border border-slate-200 bg-white p-4 text-center"><div className="text-2xl font-black">{hintedSteps.length}</div><div className="text-[10px] font-black uppercase text-slate-400">Hints</div></div></div>
            </aside>
          </div>
        ) : (
          <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Trophy className="h-11 w-11" /></div>
            <div className="flex items-center justify-center gap-2 text-sm font-black text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Result saved for your teacher</div>
            <h1 className="mt-2 text-4xl font-black text-slate-900">Puzzle complete!</h1>
            <div className="my-8 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-bambinos-50 p-4"><b className="text-2xl text-bambinos-700">{attempt.score}</b><div className="text-[10px] font-black uppercase text-slate-500">Score</div></div><div className="rounded-2xl bg-emerald-50 p-4"><b className="text-2xl text-emerald-700">{attempt.accuracy}%</b><div className="text-[10px] font-black uppercase text-slate-500">Accuracy</div></div><div className="rounded-2xl bg-amber-50 p-4"><b className="text-2xl text-amber-700">{attempt.durationSeconds}s</b><div className="text-[10px] font-black uppercase text-slate-500">Time</div></div></div>
            {launch.returnUrl ? <a href={launch.returnUrl} className="inline-flex items-center gap-2 rounded-2xl bg-bambinos-600 px-6 py-4 font-black text-white">Return to Zing lesson <ExternalLink className="h-5 w-5" /></a> : <a href="/" className="inline-flex rounded-2xl bg-bambinos-600 px-6 py-4 font-black text-white">Back to Unbox Chess</a>}
          </section>
        )}
      </main>
    </div>
  );
}
