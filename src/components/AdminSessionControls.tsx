'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

export function AdminSessionControls() {
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
    } finally {
      window.location.assign('/admin-login');
    }
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={signingOut}
      className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-2xl ring-1 ring-white/20 disabled:opacity-60"
      aria-label="Securely sign out of the admin portal"
    >
      <LogOut className="h-4 w-4" /> {signingOut ? 'Signing out…' : 'Secure sign out'}
    </button>
  );
}
