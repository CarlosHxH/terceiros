import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';

import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '@/lib/auth';
import theme from '@/lib/theme';
import Image from 'next/image';
import { ToastProvider } from '@/components/Toast';

import 'globals.css'

export const metadata = {
  title: 'Ponto Facil',
  description: 'Um sistema simples de gerenciamento de funcionários',
};

const BRANDING = {
  title: 'Sistema de Ponto',
  logo: <Image width={100} height={100} priority src='/icon.ico' alt="Logo" style={{ width: 'auto', borderRadius: '50%' }} />,
};


export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ToastProvider maxToasts={5} defaultDuration={5000}>
              {props.children}
            </ToastProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
