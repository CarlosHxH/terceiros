import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';

import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '@/auth';
import theme from '@/theme';
import Image from 'next/image';
import { ToastProvider } from '@/components/Toast';

export const metadata = {
  title: 'Ponto Facil',
  description: 'Um sistema simples de gerenciamento de funcionários',
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/employees',
    title: 'Employees',
    icon: <PersonIcon />,
    pattern: 'employees{/:employeeId}*',
  },
];

const BRANDING = {
  title: 'Sistema de Ponto',
  logo: <Image width={100} height={100} priority src='/icon.ico' alt="Logo" style={{ width: 'auto', borderRadius: '50%' }} />,
};


const AUTHENTICATION = {
  signIn,
  signOut,
};


export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>

            <NextAppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              session={session}
              authentication={AUTHENTICATION}
              theme={theme}
            >
              <ToastProvider maxToasts={5} defaultDuration={5000}>
                {props.children}
              </ToastProvider>
            </NextAppProvider>

          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
