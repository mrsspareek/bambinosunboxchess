'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Clock3, ShieldX } from 'lucide-react';
import { ZingPuzzleRunner } from '../../../components/ZingPuzzleRunner';
import { getZingPuzzle } from '../../../lib/zingPuzzleCatalog';
import { ZingLaunchRecord } from '../../../types/zing';

function LaunchError({ expired = false }: { expired?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${expired ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
          {expired ? <Clock3 className="h-9 w-9" /> : <ShieldX className="h-9 w-9" />}
        </div>
        <h1 className="text-2xl font-black text-slate-900">{expired ? 'This activity link expired' : 'This activity link is not valid'}</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">Ask your teacher for a fresh Unbox Chess activity link, then open it from the Zing lesson again.</p>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
          <AlertTriangle className="h-4 w-4" /> No result was recorded.
        </div>
      </div>
    </div>
  );
}

function ZingLaunchContent() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') || '' : '';
  const puzzle = getZingPuzzle('puzzle_queen_fork');
  
  if (!puzzle) return <LaunchError />;
  const mockLaunch: ZingLaunchRecord = {
    id: 'demo',
    assignmentId: 'asg-demo',
    puzzleId: 'puzzle_queen_fork',
    studentId: 'std-demo',
    studentName: 'Student',
    teacherId: 'tch-demo',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString()
  };
  return <ZingPuzzleRunner puzzle={puzzle} launch={mockLaunch} launchToken={token} />;
}

export default function ZingLaunchPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 p-4">
        <div className="w-8 h-8 border-4 border-bambinos-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ZingLaunchContent />
    </Suspense>
  );
}
