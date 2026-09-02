'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Sparkles, Check, X, ShieldCheck, Zap, BookOpen, Puzzle, ArrowRight, Award } from 'lucide-react';
import { BookDemoModal } from './BookDemoModal';

export const SubscriptionPaywallModal: React.FC = () => {
  const { showPaywallModal, setShowPaywallModal, paywallFeatureName, setUserTier } = useAuth();
  const [showDemoForm, setShowDemoForm] = useState(false);

  if (!showPaywallModal) return null;

  const handleOpenDemoModal = () => {
    setShowPaywallModal(false);
    setShowDemoForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative border border-slate-200 animate-scale-up text-center">
          <button
            onClick={() => setShowPaywallModal(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lock Icon Header */}
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-black text-xs rounded-full uppercase tracking-wider">
              Unlock Advanced Tactics & Curriculum
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Unlock {paywallFeatureName || 'Unbox Chess Program'}
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
              Book a Free 1-on-1 Demo session with Coach Zaid to unlock custom level tactics, personalized rating analysis, and full Unbox Chess curriculum!
            </p>
          </div>

          {/* Value Highlights */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-left text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 text-emerald-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free 1-on-1 Live Diagnostic with Coach Zaid</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Access to Level 2 (Intermediate) & Level 3 (Advanced) Puzzle Tracks</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Personalized Skill Evaluation & Tactical Roadmap for your child</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Always Free: Daily Puzzle & Live Match Arena</span>
            </div>
          </div>

          {/* Decided CTA Button */}
          <div className="space-y-3">
            <button
              onClick={handleOpenDemoModal}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
              <span>Book a Free 1-on-1 Demo to Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] font-bold text-slate-400">
              100% Free • No Credit Card Required • Instant Scheduling
            </p>
          </div>
        </div>
      </div>

      <BookDemoModal isOpen={showDemoForm} onClose={() => setShowDemoForm(false)} />
    </>
  );
};
