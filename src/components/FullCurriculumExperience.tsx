'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock3, Search, Sparkles, Target, Trophy } from 'lucide-react';
import { FULL_BEGINNER_CURRICULUM } from '../lib/fullCurriculumData';

export function FullCurriculumExperience() {
  const [selectedSession, setSelectedSession] = useState(1);
  const [query, setQuery] = useState('');
  const selected = FULL_BEGINNER_CURRICULUM[selectedSession - 1];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return FULL_BEGINNER_CURRICULUM;
    return FULL_BEGINNER_CURRICULUM.filter((session) => `${session.sessionNumber} ${session.title} ${session.topics.join(' ')}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bambinos-600 text-white shadow-lg"><BookOpen className="h-9 w-9" /></div><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Complete 48-session programme</div><h1 className="text-2xl font-black text-slate-900 md:text-3xl">Unbox Chess Curriculum</h1><p className="mt-1 text-sm font-medium text-slate-500">Ages 7–15+ · concept, guided practice, application, and measurable exit checks</p></div></div>
          <div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-bambinos-50 px-4 py-3"><b className="block text-xl text-bambinos-700">48</b><span className="text-[10px] font-black uppercase text-slate-500">Sessions</span></div><div className="rounded-2xl bg-emerald-50 px-4 py-3"><b className="block text-xl text-emerald-700">50m</b><span className="text-[10px] font-black uppercase text-slate-500">Each</span></div><div className="rounded-2xl bg-amber-50 px-4 py-3"><b className="block text-xl text-amber-700">40h</b><span className="text-[10px] font-black uppercase text-slate-500">Learning</span></div></div>
        </div>
      </header>

      <div className="grid items-start gap-7 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
          <label className="mb-3 flex items-center gap-2 rounded-2xl border border-slate-200 px-3"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all 48 sessions" className="w-full bg-transparent py-3 text-sm font-bold outline-none" /></label>
          <div className="max-h-[620px] space-y-1.5 overflow-y-auto pr-1">
            {filtered.map((session) => <button key={session.sessionNumber} onClick={() => setSelectedSession(session.sessionNumber)} className={`w-full rounded-2xl border p-3 text-left transition-all ${selectedSession === session.sessionNumber ? 'border-bambinos-600 bg-bambinos-600 text-white shadow-md' : 'border-transparent bg-slate-50 text-slate-700 hover:border-bambinos-200'}`}><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black uppercase">Session {session.sessionNumber}</span><span className={`rounded px-1.5 py-0.5 text-[8px] font-black ${selectedSession === session.sessionNumber ? 'bg-white/20' : 'bg-white text-slate-500'}`}>{session.section.replace(' CLASS', '')}</span></div><div className="mt-1 truncate text-sm font-black">{session.title}</div></button>)}
            {!filtered.length && <div className="p-6 text-center text-sm font-bold text-slate-400">No session matches that search.</div>}
          </div>
        </aside>

        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="border-b border-slate-100 pb-5"><span className="text-xs font-black uppercase tracking-widest text-bambinos-600">Session {selected.sessionNumber} · {selected.section}</span><h2 className="mt-1 text-3xl font-black text-slate-900">{selected.title}</h2><p className="mt-3 text-sm font-medium leading-6 text-slate-600">{selected.coreConcept}</p></div>
          <section><h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">Learning focus</h3><div className="flex flex-wrap gap-2">{selected.topics.map((topic) => <span key={topic} className="rounded-xl border border-bambinos-200 bg-bambinos-50 px-3 py-2 text-xs font-bold text-bambinos-800">{topic}</span>)}</div></section>
          <div className="grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-amber-800"><Sparkles className="h-4 w-4" /> Student analogy</div><p className="text-sm font-semibold leading-6 text-amber-950">{selected.analogy}</p></section><section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-emerald-800"><Target className="h-4 w-4" /> Measurable outcomes</div><p className="text-sm font-semibold leading-6 text-emerald-950">{selected.outcomeA} {selected.outcomeB}</p></section></div>
          <section><h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Clock3 className="h-4 w-4" /> 50-minute lesson flow</h3><div className="space-y-2">{selected.lessonSteps.map((lessonStep) => <div key={lessonStep.step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bambinos-600 text-xs font-black text-white">{lessonStep.step}</span><div><h4 className="text-sm font-black text-slate-900">{lessonStep.title}</h4><p className="mt-1 text-xs font-medium leading-5 text-slate-600">{lessonStep.description}</p></div></div>)}</div></section>
          <footer className="flex items-center gap-2 rounded-2xl bg-slate-900 p-4 text-xs font-bold text-white"><Trophy className="h-5 w-5 text-amber-400" /> Completion evidence: accuracy, attempts, hints, time, coach observation, and the session exit check.</footer>
        </article>
      </div>
    </div>
  );
}
