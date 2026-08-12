import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the NextAuth config — no providers, no Prisma, no
 * bcrypt. This is what middleware.ts uses, since Vercel's Edge Function
 * runtime has a 1MB bundle limit and the full auth.ts (Credentials
 * provider + Prisma Client + bcryptjs) blew well past it (~1.04MB).
 *
 * Middleware only needs to read the JWT session and check `role` — it
 * never needs to actually authenticate a login, so it doesn't need the
 * provider at all. auth.ts imports this config and adds the real
 * Credentials provider on top, for use in the Node.js runtime (API routes,
 * server actions) where bundle size isn't constrained.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/patient/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.patientId = (user as { patientId?: string | null }).patientId;
        token.doctorId = (user as { doctorId?: string | null }).doctorId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.patientId = token.patientId as string | null;
        session.user.doctorId = token.doctorId as string | null;
      }
      return session;
    },
  },
};
