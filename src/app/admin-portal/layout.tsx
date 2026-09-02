import { AdminSessionControls } from '../../components/AdminSessionControls';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return <><AdminSessionControls />{children}</>;
}
