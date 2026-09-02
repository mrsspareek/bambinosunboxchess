import { AdminSessionControls } from '../../components/AdminSessionControls';
import { requireAdminSession } from '../../lib/server/adminGate';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession('/admin');
  return <><AdminSessionControls />{children}</>;
}
