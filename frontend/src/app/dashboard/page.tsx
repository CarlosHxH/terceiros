"use client";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { PageContainer } from '@toolpad/core/PageContainer';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '../../lib/auth';

export default async function HomePage() {
  const session = await auth();
  const currentUrl = (await headers()).get('referer') || process.env.AUTH_URL || 'http://localhost:3000';
  if (!session) { // Get the current URL to redirect to signIn with `callbackUrl` 
    const redirectUrl = new URL('/auth/signin', currentUrl);
    redirectUrl.searchParams.set('callbackUrl', currentUrl);
    redirect(redirectUrl.toString());
  }


  return (
    <PageContainer>
      <Typography>
        Welcome to Toolpad, {session?.user?.name || session?.user?.email || 'User'}!
      </Typography>
    </PageContainer>
  );
}
