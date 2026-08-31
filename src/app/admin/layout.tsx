import { requireAdminSession } from '../../lib/server/adminGate';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdminSession('/admin');
  return children;
}
