import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize(c) {
      // Simulate user authentication
      if (c?.email && c?.password) {
        return {
          id: String(Date.now()),
          name: 'Test User',
          email: String(c.email),
        };
      }
      return null;
    },
  }),
];

if (!process.env.DATABASE_URL) {
  console.warn('The provider requires configuring a database.');
}

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
  experimental: {
    enableWebAuthn: true,
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt({ token, user }) {
      // Persist the user ID in the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Pass the user ID from token to session
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');

      if (isPublicPage || isLoggedIn) {
        return true;
      }

      return false;
    },
  },
});