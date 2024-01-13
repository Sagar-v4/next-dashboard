import NextAuth from "next-auth";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { db } from "@/config/env";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

const client = new MongoClient(db.MONGODB_URI);
const clientPromise = client.connect();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user }) {
      console.log("🚀 ~ signIn ~ user:", user);
      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser.isEmailVerified) {
        return false;
      }
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
