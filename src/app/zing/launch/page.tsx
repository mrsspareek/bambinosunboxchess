import { AlertTriangle, Clock3, ShieldX } from 'lucide-react';
import { ZingPuzzleRunner } from '../../../components/ZingPuzzleRunner';
import { getLaunch } from '../../../lib/server/launchRepository';
import { verifyLaunchToken } from '../../../lib/server/integrationSecurity';
import { getZingPuzzle } from '../../../lib/zingPuzzleCatalog';

function LaunchError({ expired = false }: { expired?: boolean }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 p-4"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl"><div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${expired ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{expired ? <Clock3 className="h-9 w-9" /> : <ShieldX className="h-9 w-9" />}</div><h1 className="text-2xl font-black text-slate-900">{expired ? 'This activity link expired' : 'This activity link is not valid'}</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-500">Ask your teacher for a fresh Unbox Chess activity link, then open it from the Zing lesson again.</p><div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500"><AlertTriangle className="h-4 w-4" /> No result was recorded.</div></div></div>;
}

export default async function ZingLaunchPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || '';
  const tokenPayload = token ? verifyLaunchToken(token) : null;
  if (!tokenPayload) return <LaunchError />;
  const launch = await getLaunch(tokenPayload.launchId);
  if (!launch || new Date(launch.expiresAt).getTime() <= Date.now()) return <LaunchError expired />;
  const puzzle = getZingPuzzle(launch.puzzleId);
  if (!puzzle) return <LaunchError />;
  return <ZingPuzzleRunner puzzle={puzzle} launch={launch} launchToken={token} />;
}
