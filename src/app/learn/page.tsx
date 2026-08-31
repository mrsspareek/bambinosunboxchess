'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GraduationCap, ExternalLink, Calendar, Clock, Video, CheckCircle2, X } from 'lucide-react';

export default function LearnPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoBooked, setDemoBooked] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bambinos-600 text-white flex items-center justify-center shadow-lg shadow-bambinos-600/30">
            <GraduationCap className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Unbox Chess Learning Hub</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Live interactive masterclasses & course presentations on Zing</p>
          </div>
        </div>

        {/* Book Live Demo Primary CTA */}
        <button
          onClick={() => setShowDemoModal(true)}
          className="py-4 px-6 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-base rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center gap-3 transition-transform active:scale-95 whitespace-nowrap"
        >
          <Video className="w-5 h-5" />
          Book a Live Demo for Chess
        </button>
      </div>

      {/* Zing Platform Embedded Preview Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              Zing Platform Live Integration
            </h3>
            <p className="text-xs font-semibold text-slate-500">Access your enrolled Bambinos presentation decks & session materials</p>
          </div>
          <a
            href="https://zing.bambinos.live/teacher?folder=57&subfolder=108"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-bambinos-600 hover:text-bambinos-800 font-extrabold text-sm bg-bambinos-50 px-4 py-2 rounded-xl border border-bambinos-200"
          >
            Open Zing Platform <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Zing Sessions Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {['Session-1: Meet the Army', 'Session-2: Board Masterclass', 'Session-3: Rook & Bishop', 'Session-4: Heavy Hitters', 'chess_demo_beginner_(7-10)', 'chess_demo_beginner_(10+)'].map((title, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-bambinos-400 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-bambinos-100 text-bambinos-700 font-black flex items-center justify-center text-sm">
                S{idx + 1}
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{title}</h4>
              <p className="text-xs font-medium text-slate-500">Interactive slide deck & guided practice activities ready for class.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-bambinos-600">
                <span>4 Activities</span>
                <span className="hover:underline cursor-pointer">Launch Deck &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Live Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-slate-200 animate-scale-up">
            <button
              onClick={() => { setShowDemoModal(false); setDemoBooked(false); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            {!demoBooked ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-bambinos-100 text-bambinos-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <Video className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Book a Free 1-on-1 Live Chess Demo</h3>
                  <p className="text-xs font-medium text-slate-500">Experience interactive chess coaching live with Bambinos master trainers</p>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Student Name</label>
                    <input type="text" placeholder="e.g. Zaid Iqbal" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Age Group</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-medium text-sm bg-white">
                      <option>7 – 10 Years Old (Beginner)</option>
                      <option>10+ Years Old (Intermediate/Advanced)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Preferred Date & Time</label>
                    <input type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-bambinos-600 font-medium text-sm" />
                  </div>
                </div>

                <button
                  onClick={() => setDemoBooked(true)}
                  className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-bambinos-600/30 transition-transform active:scale-95"
                >
                  Confirm Live Demo Booking
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900">Demo Session Confirmed!</h3>
                <p className="text-sm font-medium text-slate-600">Your live 1-on-1 demo link has been sent to your WhatsApp/Email. Get ready to play!</p>
                <button
                  onClick={() => { setShowDemoModal(false); setDemoBooked(false); }}
                  className="py-3 px-8 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
