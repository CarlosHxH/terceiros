import NextAuth from "next-auth"
import { signIn as signInAPI } from "@/services/auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const response = await signInAPI({ email: credentials.email as string, password: credentials.password as string })
        
        if (!response) return null;
        return {
          id: response.data?.usuario.id,
          name: response.data?.usuario.first_name,
          email: response.data?.usuario.email,
          access_token: response.data?.tokens.access,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.id = user.id as number;
        token.access_token = user.access_token;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.access_token = token.access_token as string;
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      //log.error(code, message)
    },
    warn(code, ...message) {
      //log.warn(code, message)
    },
    debug(code, ...message) {
      //log.debug(code, message)
    },
  },
})