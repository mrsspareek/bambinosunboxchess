'use client';

import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accessCode })
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Sign-in failed.');
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.assign(next?.startsWith('/') && !next.startsWith('//') ? next : '/admin-portal');
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Sign-in failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bambinos-600 p-2 shadow-lg">
            <Image src="/logo.png" alt="Bambinos" width={48} height={48} className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin secure sign-in</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Protected server-side with an encrypted, HTTP-only session cookie.</p>
        </div>

        <form onSubmit={signIn} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600">Admin access code</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-bambinos-500 focus-within:ring-2 focus-within:ring-bambinos-100">
              <LockKeyhole className="h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-transparent py-4 text-sm font-bold outline-none"
                placeholder="Enter access code (admin123)"
              />
            </div>
          </label>

          {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-bambinos-600 px-4 py-4 font-black text-white shadow-lg shadow-bambinos-600/20 disabled:opacity-60">
            <ShieldCheck className="h-5 w-5" /> {submitting ? 'Verifying…' : 'Open admin portal'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs font-bold text-slate-500">Admin passcode: admin123</p>
      </div>
    </div>
  );
}
