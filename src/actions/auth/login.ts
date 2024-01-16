"use server";

import * as z from "zod";
import crypto from "crypto";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { IUserBase } from "@/lib/model/user";
import { generateToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { send2FAEmail } from "@/helper/smtp-email";
import { deletTokenById, getTokenByEmail } from "@/data/token";

type loginType = z.SafeParseReturnType<
  {
    email: string;
    password: string;
    code?: string | undefined;
  },
  {
    email: string;
    password: string;
    code?: string | undefined;
  }
>;

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  try {
    const validatedFields: loginType = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "User doesn't exist!" };
    }

    if (!existingUser.emailVerified) {
      const verificationEmailToken: ITokenBase | null = await generateToken(
        existingUser.email as string,
        TokenTypes.VERIFICATION
      );
      if (!verificationEmailToken) {
        return { error: "Failed to generate token!" };
      }

      // TODO: send email verification mail
      // await sendVerificationEmail(
      //   verificationToken.email,
      //   verificationToken.token,
      // );

      return { success: "Verification email sent!" };
    }

    if (existingUser.twoFactorAuthentication && existingUser.email) {
      if (code) {
        const twoFactorToken: ITokenBase | null = await getTokenByEmail(
          existingUser.email as string,
          TokenTypes["2FA"]
        );
        if (!twoFactorToken) {
          return { error: "Two factor token not found!" };
        }
        if (twoFactorToken.details.code !== code) {
          return { error: "Invalid Code!" };
        }

        const hasExpired =
          new Date(twoFactorToken.expiresAt as number) < new Date();
        if (hasExpired) {
          return { error: "Code expired!" };
        }

        const tokenDeleted: ITokenBase | null = await deletTokenById(
          twoFactorToken._id
        );
        if (!tokenDeleted) {
          return { error: "Failed to delete token!" };
        }
      } else {
        const code: string = crypto.randomInt(1_00_000, 9_99_999).toString();
        const verification2FAToken: ITokenBase | null = await generateToken(
          existingUser.email as string,
          TokenTypes["2FA"],
          {
            code: code,
          }
        );
        if (!verification2FAToken) {
          return { error: "Failed to generate token!" };
        }

        const isEMailSent: boolean = await send2FAEmail(
          verification2FAToken.email as string,
          verification2FAToken.details.code as string
        );
        if (!isEMailSent) {
          return { error: "Failed to send email!" };
        }

        return { twoFactor: true };
      }
    }
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "AuthorizedCallbackError":
          return { error: "Access denied!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
