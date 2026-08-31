'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Sparkles, Check, X, ShieldCheck, Zap, BookOpen, Puzzle } from 'lucide-react';

export const SubscriptionPaywallModal: React.FC = () => {
  const { showPaywallModal, setShowPaywallModal, paywallFeatureName, setUserTier } = useAuth();

  if (!showPaywallModal) return null;

  const handleSubscribe = () => {
    setUserTier('subscribed');
    setShowPaywallModal(false);
    alert('Congratulations! Your UnboxChess Student Subscription is now ACTIVE. All learning features unlocked!');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative border border-slate-200 animate-scale-up text-center">
        <button
          onClick={() => setShowPaywallModal(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Lock Icon Header */}
        <div className="w-16 h-16 bg-bambinos-100 text-bambinos-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-black text-xs rounded-full uppercase tracking-wider">
            Premium Student Feature
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            Unlock {paywallFeatureName || 'UnboxChess Learning Hub'}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Free players can play online games. Upgrade to an UnboxChess Subscription to access Puzzles, Zing presentations, and the 48-session curriculum!
          </p>
        </div>

        {/* Feature Comparison Tiers */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-left text-xs font-bold text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-black text-slate-900">
            <span>Platform Features</span>
            <span>Subscribed Student</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Play Online & AI Bot Matches</span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1"><Check className="w-4 h-4" /> Included</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Chess Puzzles Studio & Streaks</span>
            <span className="text-bambinos-600 font-black flex items-center gap-1"><Check className="w-4 h-4" /> Subscribed Only</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>48-Session Curriculum PDF Masterplan</span>
            <span className="text-bambinos-600 font-black flex items-center gap-1"><Check className="w-4 h-4" /> Subscribed Only</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Zing Live Decks & 1-on-1 Demo Booking</span>
            <span className="text-bambinos-600 font-black flex items-center gap-1"><Check className="w-4 h-4" /> Subscribed Only</span>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            className="w-full py-4 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Sparkles className="w-5 h-5" /> Subscribe Now - $199/Year
          </button>
        </div>
      </div>
    </div>
  );
};
