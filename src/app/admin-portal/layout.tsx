import { AdminSessionControls } from '../../components/AdminSessionControls';
import { requireAdminSession } from '../../lib/server/adminGate';

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession('/admin-portal');
  return <><AdminSessionControls />{children}</>;
}
