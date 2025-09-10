'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import { providerMap } from '@/auth';
import { AppProvider, type AuthProvider } from '@toolpad/core';
import serverSignIn from './actions';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const signIn = async (provider: AuthProvider, formData: FormData, callbackUrl?: string) => {
  // Use server action for other providers
  return serverSignIn(provider, formData, callbackUrl);
};

const BRANDING = {
  logo: (<img src="/logo.png" alt="5sTransportes" style={{ height: 96 }} />),
  title: '5sTransportes',
};

export default function SignIn() {
  const theme = useTheme();
  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <SignInPage
        slots={{
          title: () => <Typography variant='subtitle1' color='primary' fontWeight={'bold'}>Sistema de Ponto</Typography>,
          subtitle: () => <Typography variant='subtitle2' color='textSecondary'>Por favor faça login para continuar</Typography>,
        }}
        localeText={{
          providerSignInTitle: (provider: string) => `ENTRAR`,
        }}
        providers={providerMap}
        signIn={signIn}
      />
    </AppProvider>
  );
}