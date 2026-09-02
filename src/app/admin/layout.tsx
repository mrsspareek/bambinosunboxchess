import { AdminSessionControls } from '../../components/AdminSessionControls';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><AdminSessionControls />{children}</>;
}
