import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, validAdminSession } from './adminSecurity';

export async function requireAdminSession(nextPath: string): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!validAdminSession(token)) redirect(`/admin-login?next=${encodeURIComponent(nextPath)}`);
}
