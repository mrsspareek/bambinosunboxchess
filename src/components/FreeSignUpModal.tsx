'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Phone,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  MessageSquare,
  RefreshCw,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FreeSignUpModalProps {
  isOpen: boolean;
  onSuccess: (userData: StudentUserData, isSubscribed?: boolean) => void;
  onClose?: () => void;
}

export interface StudentUserData {
  name: string;
  phone: string;
  age: string;
  place: string;
  verifiedAt: string;
  loginMethod?: 'google' | 'mobile';
  email?: string;
  isSubscribed?: boolean;
  studentId?: string;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: '🇮🇳 India (+91)' },
  { code: '+1', country: 'US', label: '🇺🇸 USA (+1)' },
  { code: '+44', country: 'UK', label: '🇬🇧 UK (+44)' },
  { code: '+971', country: 'UAE', label: '🇦🇪 UAE (+971)' },
  { code: '+65', country: 'SG', label: '🇸🇬 Singapore (+65)' },
  { code: '+61', country: 'AU', label: '🇦🇺 Australia (+61)' }
];

export const FreeSignUpModal: React.FC<FreeSignUpModalProps> = ({ isOpen, onSuccess }) => {
  // Login Method: 'google' | 'mobile'
  const [loginMethod, setLoginMethod] = useState<'google' | 'mobile'>('google');

  // Mobile Auth Flow Steps: 'phone' -> 'otp' -> 'create_profile' (only if new user)
  const [step, setStep] = useState<'phone' | 'otp' | 'create_profile'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentNotification, setOtpSentNotification] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // New Profile Details (Collected only if account does not exist)
  const [name, setName] = useState('');
  const [age, setAge] = useState('7-10 Years');
  const [place, setPlace] = useState('');
  const [email, setEmail] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  // Google Auth State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      const googleUser: StudentUserData = {
        name: 'Zaid Iqbal',
        phone: 'Google Account',
        age: '7-10 Years',
        place: 'Google Auth',
        verifiedAt: new Date().toISOString(),
        loginMethod: 'google',
        email: 'zaidiqbal.chess@gmail.com',
        isSubscribed: true
      };

      try {
        localStorage.setItem('unbox_student_user', JSON.stringify(googleUser));
        const signupsRaw = localStorage.getItem('unbox_analytics_signups') || '[]';
        const signupsList = JSON.parse(signupsRaw);
        signupsList.unshift(googleUser);
        localStorage.setItem('unbox_analytics_signups', JSON.stringify(signupsList.slice(0, 100)));
      } catch (err) {
        console.error(err);
      }

      onSuccess(googleUser, true);
    }, 800);
  };

  // Step 1: Send Mobile OTP (Only asks for Phone Number)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('Please enter your mobile phone number.');
      return;
    }

    setIsSendingOtp(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setOtpSentNotification(true);
    }, 600);
  };

  // Step 2: Verify OTP (Any 6-digit OTP code works!)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setOtpError('Please enter a 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    setTimeout(() => {
      setIsVerifying(false);
      const fullPhone = `${countryCode} ${phone.trim()}`;
      
      // Check if student user account already exists in localStorage or saved analytics
      const existingUserRaw = typeof window !== 'undefined' ? localStorage.getItem('unbox_student_user') : null;
      let existingUser: StudentUserData | null = null;
      if (existingUserRaw) {
        try {
          const parsed = JSON.parse(existingUserRaw);
          if (parsed && (parsed.phone === fullPhone || (parsed.phone && parsed.phone.includes(phone.trim())))) {
            existingUser = parsed;
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (existingUser) {
        // Account already exists! Log in directly without asking Name/Age/City!
        onSuccess(existingUser, true);
      } else {
        // Account does NOT exist -> Prompt to complete new student profile
        setStep('create_profile');
      }
    }, 500);
  };

  // Step 3: Submit New Profile Details
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !place.trim()) {
      alert('Please enter your name and city/place.');
      return;
    }

    setIsCreatingProfile(true);
    const fullPhone = `${countryCode} ${phone.trim()}`;
    const newUserData: StudentUserData = {
      name: name.trim(),
      age,
      place: place.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@student.unboxchess.com`,
      phone: fullPhone,
      verifiedAt: new Date().toISOString(),
      loginMethod: 'mobile',
      isSubscribed: true
    };

    setTimeout(() => {
      setIsCreatingProfile(false);
      try {
        localStorage.setItem('unbox_student_user', JSON.stringify(newUserData));
        const signupsRaw = localStorage.getItem('unbox_analytics_signups') || '[]';
        const signupsList = JSON.parse(signupsRaw);
        signupsList.unshift(newUserData);
        localStorage.setItem('unbox_analytics_signups', JSON.stringify(signupsList.slice(0, 100)));
      } catch (err) {
        console.error(err);
      }

      onSuccess(newUserData, true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-2 shadow-sm">
            <Image
              src="./logo2.png"
              alt="Unbox Chess Logo"
              width={52}
              height={52}
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome to Unbox Chess
            </h2>
            <p className="text-xs font-bold text-slate-500 max-w-xs mx-auto">
              One account to Play Arena, Daily Puzzles & Global Leaderboards
            </p>
          </div>
        </div>

        {/* Login Method Toggle Tabs (Google vs Mobile Number) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('google');
              setStep('phone');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'google'
                ? 'bg-white text-slate-900 shadow-md border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMethod('mobile')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'mobile'
                ? 'bg-bambinos-600 text-white shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
        </div>

        {/* METHOD 1: GOOGLE LOGIN */}
        {loginMethod === 'google' && (
          <div className="space-y-4 pt-1">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-1">
              <p className="text-xs font-bold text-slate-700">
                Works universally to log in or instantly create your new account with Google.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-4 bg-white hover:bg-slate-50 text-slate-900 font-black text-sm rounded-2xl border-2 border-slate-200 shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 hover:border-slate-300 disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-bambinos-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setLoginMethod('mobile')}
                className="text-xs font-bold text-bambinos-600 hover:underline"
              >
                Or Continue with Mobile Phone OTP →
              </button>
            </div>
          </div>
        )}

        {/* METHOD 2: MOBILE NUMBER AUTH (2-STAGE: PHONE ONLY -> OTP -> CREATE PROFILE IF NEW) */}
        {loginMethod === 'mobile' && (
          <div>
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-500 flex items-center justify-between">
                    <span>Mobile Phone Number</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> WhatsApp / SMS OTP
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-2 py-3 text-xs font-bold text-slate-900 outline-none shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>

                    <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus-within:border-bambinos-500 focus-within:bg-white transition-all">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="98765 43210"
                        className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp || !phone.trim()}
                  className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isSendingOtp ? 'Sending OTP...' : 'Send Mobile OTP →'}</span>
                </button>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('google')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline"
                  >
                    ← Back to Google Login
                  </button>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 text-center">
                  <span>Verification code sent to <strong className="text-slate-900">{countryCode} {phone}</strong></span>
                </div>

                <div className="space-y-2 text-center">
                  <label className="text-xs font-black uppercase text-slate-500 block">
                    Enter 6-Digit Verification Code
                  </label>

                  <div className="flex justify-center">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                      placeholder="• • • • • •"
                      className="w-56 text-center tracking-[0.4em] sm:tracking-[0.5em] text-xl font-black bg-slate-50 border-2 border-bambinos-500 focus:border-bambinos-600 focus:bg-white rounded-2xl py-3 text-slate-900 outline-none shadow-inner"
                    />
                  </div>

                  {otpError && (
                    <p className="text-xs font-bold text-rose-600">{otpError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.length < 6}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying Code...' : 'Verify & Continue →'}</span>
                </button>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                    className="text-bambinos-600 hover:underline"
                  >
                    ← Change Phone Number
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert('Resent 6-digit OTP code!');
                    }}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                  </button>
                </div>
              </form>
            )}

            {step === 'create_profile' && (
              <form onSubmit={handleCreateProfile} className="space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                  <span>Phone Verified! Fill in your details below to finish setup.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Child / Student Name</label>
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white transition-all">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Zaid Iqbal"
                      className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500">Age Group</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white transition-all">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                      >
                        <option value="5-6 Years">5-6 Years</option>
                        <option value="7-10 Years">7-10 Years</option>
                        <option value="11-14 Years">11-14 Years</option>
                        <option value="15+ Years">15+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500">City / Place</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white transition-all">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        required
                        placeholder="e.g. Bangalore"
                        className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500">Email Address</label>
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-bambinos-500 focus-within:bg-white transition-all">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. zaid@example.com"
                      className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingProfile || !name.trim() || !place.trim() || !email.trim()}
                  className="w-full py-3.5 bg-bambinos-600 hover:bg-bambinos-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-bambinos-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60 mt-3"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{isCreatingProfile ? 'Creating Account...' : 'Complete Setup & Play →'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

