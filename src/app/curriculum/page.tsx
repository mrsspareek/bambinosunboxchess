'use client';

import React, { useState } from 'react';
import { BEGINNER_CURRICULUM } from '../../lib/curriculumData';
import { BookOpen, Sparkles, Trophy, Bot, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CurriculumPage() {
  const [activeTab, setActiveTab] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedSession, setSelectedSession] = useState<number>(1);

  const currentSessionData = BEGINNER_CURRICULUM.find(s => s.sessionNumber === selectedSession) || BEGINNER_CURRICULUM[0];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
            <BookOpen className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Unbox Chess Curriculum</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Structured 48-session 50-minute masterplan syllabus</p>
          </div>
        </div>

        {/* Level Track Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('beginner')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'beginner'
                ? 'bg-bambinos-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beginner (Ages 7–10)
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'advanced'
                ? 'bg-bambinos-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Advanced Track
          </button>
        </div>
      </div>

      {activeTab === 'beginner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Session List Sidebar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 py-2">48 Detailed Session Plans</h3>
            {BEGINNER_CURRICULUM.map((s) => (
              <button
                key={s.sessionNumber}
                onClick={() => setSelectedSession(s.sessionNumber)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                  selectedSession === s.sessionNumber
                    ? 'bg-bambinos-50 border-bambinos-300 text-bambinos-900 font-black shadow-sm'
                    : 'border-transparent hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-bambinos-600">Session {s.sessionNumber}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{s.section}</span>
                </div>
                <div className="text-sm font-bold truncate">{s.title}</div>
              </button>
            ))}
          </div>

          {/* Session Detail Content */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-bambinos-600 uppercase tracking-widest">Session {currentSessionData.sessionNumber} Syllabus</span>
                <h2 className="text-2xl font-black text-slate-900">{currentSessionData.title}</h2>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-bambinos-100 text-bambinos-800 font-black text-xs">
                {currentSessionData.section}
              </span>
            </div>

            {/* Topics Covered */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {currentSessionData.topics.map((t, i) => (
                  <span key={i} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                    📌 {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Kid-Friendly Explanation & Analogy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <h5 className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
                  💡 Kid-Friendly Explanation
                </h5>
                <p className="text-xs font-medium text-amber-950">{currentSessionData.kidExplanation}</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-1">
                <h5 className="text-xs font-black text-indigo-800 uppercase flex items-center gap-1.5">
                  🚀 Everyday Analogy
                </h5>
                <p className="text-xs font-medium text-indigo-950">{currentSessionData.analogy}</p>
              </div>
            </div>

            {/* Target Outcomes */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Expected Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Practical: {currentSessionData.outcomeA}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-bambinos-600 shrink-0 mt-0.5" />
                  <span>Execution: {currentSessionData.outcomeB}</span>
                </div>
              </div>
            </div>

            {/* Lesson Step Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">50-Minute Lesson Plan Timeline</h4>
              <div className="space-y-2">
                {currentSessionData.lessonSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="w-7 h-7 rounded-xl bg-bambinos-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-900">{step.title}</div>
                      <div className="text-xs font-medium text-slate-600 mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Trophy className="w-16 h-16 text-bambinos-600 mx-auto" />
          <h3 className="text-2xl font-black text-slate-900">Advanced Masterclass Track</h3>
          <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
            Advanced positional strategy, deep tactical calculation, endgame mastery, and FIDE tournament preparation modules.
          </p>
        </div>
      )}
    </div>
  );
}
