import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { type Navigation } from '@toolpad/core/AppProvider';
import Image from 'next/image';
import theme from '@/lib/theme';
import { signIn, signOut } from 'next-auth/react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { auth } from '@/lib/auth';
import { AuthMiddleware } from '@/components/middlewares/auth-middleware';

export default async function Layout(props: { children: React.ReactNode }) {

  const session = await auth();
  const AUTHENTICATION = {
    signIn,
    signOut,
  };

  const NAVIGATION: Navigation = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: '/',
      title: 'Inicio',
      icon: <DashboardIcon />,
    },
    {
      segment: '/ponto',
      title: 'ponto',
      icon: <PersonIcon />,
    },
  ];
  const BRANDING = {
    title: 'Sistema de Ponto',
    logo: <Image width={100} height={100} priority src='/icon.ico' alt="Logo" style={{ width: 'auto', borderRadius: '50%' }} />,
  };

  return (
    <AuthMiddleware>
      <NextAppProvider authentication={AUTHENTICATION} branding={BRANDING} navigation={NAVIGATION} session={session} theme={theme}>
        <DashboardLayout>
          {props.children}
        </DashboardLayout>
      </NextAppProvider>
    </AuthMiddleware>
  );
}  
