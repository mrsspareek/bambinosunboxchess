import { requireAdminSession } from '../../lib/server/adminGate';

export const dynamic = 'force-dynamic';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  requireAdminSession('/admin-portal');
  return children;
}
