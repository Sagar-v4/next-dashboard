import NextAuth from "next-auth";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { db } from "@/config/env";
import authConfig from "@/auth.config";
import { authLinks } from "@/config/site";
import { getUserById } from "@/data/user";

const client = new MongoClient(db.MONGODB_URI);
const clientPromise = client.connect();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: authLinks.login.href,
    error: authLinks.error.href,
  },
  events: {
    async linkAccount({ user }) {
      // Link account to credentials account
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // TODO: add 2FA check
      return true;
    },
    async session({ token, session }) {
      console.log("🚀 ~ session ~ token, session:", token, session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.roles && session.user) {
        session.user.roles = token.roles;
      }

      return session;
    },
    async jwt({ token }) {
      // token.sub === user._id
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.roles = existingUser.roles;

      return token;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  ...authConfig,
});
