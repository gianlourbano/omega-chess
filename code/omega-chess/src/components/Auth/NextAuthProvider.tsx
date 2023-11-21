'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function NextAuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null
}) {
  return <SessionProvider session={session} basePath='/api/auth'>{children}</SessionProvider>;
}