import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id },
          select: { status: true, currentPeriodEnd: true },
        });

        session.user.tier =
          subscription?.status === "active" &&
          subscription.currentPeriodEnd &&
          subscription.currentPeriodEnd > new Date()
            ? "pro"
            : "free";
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
