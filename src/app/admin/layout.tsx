import { requireAdminSession } from '../../lib/server/adminGate';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession('/admin');
  return children;
}
