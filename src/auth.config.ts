import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { github, google } from "@/config/env";

export default {
  providers: [
    Google({
      clientId: google.GOOGLE_CLIENT_ID,
      clientSecret: google.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: github.GITHUB_CLIENT_ID,
      clientSecret: github.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials): Promise<any> {
        const validateFields = LoginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const user: IUserBase | null = await getUserByEmail(email);
          console.log("🚀 ~ authorize ~ user:", user);

          if (!user || !user.password) return null;

          const passwordMatch = user.compareHash(password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
