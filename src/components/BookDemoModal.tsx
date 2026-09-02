'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle,
  X,
  Award,
  ShieldCheck,
  Zap,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('Zaid Iqbal');
  const [ageGroup, setAgeGroup] = useState('7-10 Years');
  const [parentPhone, setParentPhone] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Today • 6:00 PM - 7:00 PM');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            {/* Header with Bambinos Branding */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>FREE 1-ON-1 DEMO WITH COACH ZAID</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Book a Free Demo for Unbox Chess
              </h2>
              <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
                Get a personalized 1-on-1 live chess assessment with Coach Zaid.
              </p>
            </div>

            {/* Benefits Highlights */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <div className="space-y-1">
                <div className="text-base">🏆</div>
                <div className="text-[10px] font-black text-slate-800">Coach Zaid</div>
              </div>
              <div className="space-y-1 border-x border-slate-200">
                <div className="text-base">🎯</div>
                <div className="text-[10px] font-black text-slate-800">1-on-1 Diagnostic</div>
              </div>
              <div className="space-y-1">
                <div className="text-base">🎁</div>
                <div className="text-[10px] font-black text-slate-800">Free Roadmap</div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Child's Name</label>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    placeholder="Child's full name"
                    className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Age Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="5-6 Years">5 - 6 Years</option>
                    <option value="7-10 Years">7 - 10 Years</option>
                    <option value="11-14 Years">11 - 14 Years</option>
                    <option value="15+ Years">15+ Years</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Parent WhatsApp No.</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500">Preferred Live Demo Slot</label>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="Today • 6:00 PM - 7:00 PM">Today • 6:00 PM - 7:00 PM</option>
                    <option value="Tomorrow • 5:00 PM - 6:00 PM">Tomorrow • 5:00 PM - 6:00 PM</option>
                    <option value="Tomorrow • 7:00 PM - 8:00 PM">Tomorrow • 7:00 PM - 8:00 PM</option>
                    <option value="Saturday • 11:00 AM - 12:00 PM">Saturday • 11:00 AM - 12:00 PM</option>
                    <option value="Sunday • 5:00 PM - 6:00 PM">Sunday • 5:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60 mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming Demo Slot...' : 'Confirm Free 1-on-1 Demo Booking'}</span>
              </button>
            </form>

            <p className="text-[10px] text-center font-bold text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Free • No Credit Card Required • Live over Google Meet / Zoom
            </p>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Demo Class Confirmed!</h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                We've reserved a free 1-on-1 session for <strong className="text-slate-900">{studentName}</strong> on <span className="text-bambinos-600 font-bold">{preferredSlot}</span>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 space-y-1 text-left">
              <div>🎯 <strong>Coach Assigned:</strong> Coach Zaid (FIDE Certified Master)</div>
              <div>📱 <strong>Confirmation Sent:</strong> WhatsApp to {parentPhone || 'registered phone'}</div>
              <div>💻 <strong>Platform:</strong> Unbox Chess Live Interactive Board</div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-xs rounded-2xl shadow-md"
            >
              Back to Unbox Chess
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
