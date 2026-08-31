import { requireAdminSession } from '../../lib/server/adminGate';

export const dynamic = 'force-dynamic';

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession('/admin-portal');
  return children;
}
