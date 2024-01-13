import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { IUserBase } from "@/lib/model/user";

export default {
  providers: [
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
