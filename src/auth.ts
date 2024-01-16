import NextAuth from "next-auth";
import { MongoClient } from "mongodb";

import { db } from "@/config/env";
import authConfig from "@/auth.config";
import { authLinks } from "@/config/site";
import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { deletTokenById, getTokenByEmail } from "@/data/token";

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

      const existingUser: IUserBase | null = await getUserById(user.id);
      if (!existingUser) return false;

      // Prevent sign in without email verification
      if (!existingUser.emailVerified) return false;

      // TODO: send email for verification if not verified

      // TODO: after verification save date till it will be verified logic
      if (existingUser.twoFactorAuthentication) {
        const twoFactorToken: ITokenBase | null = await getTokenByEmail(
          existingUser.email as string,
          TokenTypes["2FA"]
        );
        // if twoFactorToken is not exist then good to go
        if (!twoFactorToken) return true;

        // if twoFactorToken exist then delete that token
        const tokenDeleted: ITokenBase | null = await deletTokenById(
          twoFactorToken._id
        );
        // if tokenDeleted no deleted then throw error
        if (!tokenDeleted) return false;
      }

      // TODO: add 2FA check
      return true;
    },
    async session({ token, session }) {
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
