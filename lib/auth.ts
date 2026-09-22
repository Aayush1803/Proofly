import { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

// ─── Helper: record a login event ────────────────────────────────────────────
async function recordLoginEvent(userId: string, provider: string) {
  try {
    await prisma.loginEvent.create({
      data: {
        userId,
        provider,
        // IP / UA not available inside NextAuth callbacks — populated from API headers where possible
      },
    });
  } catch (err) {
    // Non-fatal — never block login over a logging failure
    console.error('[Auth] Failed to record login event:', err);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        name:     { label: 'Full Name',    type: 'text' },
        email:    { label: 'Email',        type: 'email' },
        password: { label: 'Password',     type: 'password' },
        mode:     { label: 'Mode',         type: 'text' },   // 'login' | 'signup'
        otpCode:  { label: 'OTP Code',     type: 'text' },   // 6-digit code for signup
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password, name, mode, otpCode } = credentials;

        // ── Sign Up ────────────────────────────────────────────────────────────
        if (mode === 'signup') {
          // 1. Verify OTP against DB — prevents bypass without a real OTP
          if (!otpCode) throw new Error('Email verification code is required.');

          const otp = await prisma.otpCode.findFirst({
            where: {
              email,
              code: otpCode,
              used: false,
              expiresAt: { gt: new Date() },
            },
          });

          if (!otp) {
            throw new Error('Invalid or expired verification code. Please request a new one.');
          }

          // Mark OTP as used
          await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

          // 2. Guard against duplicate emails (race condition)
          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
            throw new Error('An account with this email already exists.');
          }

          // 3. Hash password + create user
          const hash = await bcrypt.hash(password, 12);
          const user = await prisma.user.create({
            data: {
              name: name?.trim() || email.split('@')[0],
              email,
              passwordHash: hash,
              emailVerified: true, // OTP verified ✅
            },
          });

          // 4. Record first login event
          await recordLoginEvent(user.id, 'credentials');

          return { id: user.id, name: user.name, email: user.email, image: null };
        }

        // ── Login ──────────────────────────────────────────────────────────────
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('No account found with this email.');
        if (!user.passwordHash) throw new Error('This account uses Google Sign-In. Please continue with Google.');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('Incorrect password.');

        // Record login
        await recordLoginEvent(user.id, 'credentials');

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: { signIn: '/' },

  callbacks: {
    async jwt({ token, user, account, profile }: { token: JWT; user?: User; account?: any; profile?: any }) {
      if (user) {
        token.id    = user.id;
        token.image = user.image ?? null;
      }

      // Persist Google user on first sign-in
      if (account?.provider === 'google' && profile?.email) {
        const gName  = profile.name  || profile.email.split('@')[0];
        const gImage = profile.picture || null;

        try {
          const dbUser = await prisma.user.upsert({
            where:  { email: profile.email },
            update: { name: gName, image: gImage, updatedAt: new Date() },
            create: { email: profile.email, name: gName, image: gImage, emailVerified: true },
          });
          token.id    = dbUser.id;
          token.image = dbUser.image;

          // Record login event for Google
          await recordLoginEvent(dbUser.id, 'google');
        } catch (err) {
          // DB unavailable — still allow login via JWT
          console.error('[Auth] DB upsert failed, using profile fallback:', err);
          token.id    = profile.email;
          token.image = gImage;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        const tokenImage = token.image as string | null | undefined;
        session.user.image = tokenImage ?? session.user.image;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
