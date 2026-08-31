import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const production = process.env.NODE_ENV === 'production';
  const checks = {
    appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL) || !production,
    adminAccess: Boolean(process.env.ADMIN_ACCESS_CODE) || !production,
    adminSession: Boolean(process.env.ADMIN_SESSION_SECRET) || !production,
    zingSigning: Boolean(process.env.ZING_LAUNCH_SECRET) || !production,
    dataDirectory: Boolean(process.env.UNBOX_DATA_DIR) || !production
  };
  const ready = Object.values(checks).every(Boolean);
  return NextResponse.json(
    { status: ready ? 'ready' : 'configuration_required', checks, timestamp: new Date().toISOString() },
    { status: ready ? 200 : 503, headers: { 'cache-control': 'no-store' } }
  );
}
