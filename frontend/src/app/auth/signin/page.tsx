'use client';
  import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import { providerMap } from '../../../auth';
import type { AuthProvider } from '@toolpad/core';
import serverSignIn from './actions';

const signIn = async (provider: AuthProvider, formData: FormData, callbackUrl?: string) => {
  // Use server action for other providers
  return serverSignIn(provider, formData, callbackUrl);
};

export default function SignIn() {

  return (
    <SignInPage
      title="Sign In"
      subtitle="Sign in to your account"
      providers={providerMap}
      signIn={signIn}
    />
  );
}