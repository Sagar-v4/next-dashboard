"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import crypto from "crypto";
import { signIn } from "@/auth";
import { Logger } from "@/logger/logger";
import { IUserBase } from "@/lib/model/user";
import { LoginSchema } from "@/schemas/auth";
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
    Logger.trace({
      message: "Entering into login function",
      callbackUrl: callbackUrl,
      values: values,
    });

    const validatedFields: loginType = LoginSchema.safeParse(values);
    Logger.debug({
      message: "Validation fields!",
      validatedFields: validatedFields,
    });

    if (!validatedFields.success) {
      Logger.error({
        message: "Invalid failed!",
        success: validatedFields.success,
      });
      return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      Logger.error({
        message: "User doesn't exist!",
        user: existingUser,
      });
      return { error: "User doesn't exist!" };
    }

    Logger.debug({
      message: "User details!",
      userId: existingUser._id,
    });

    if (!existingUser.emailVerified) {
      Logger.debug({
        message: "User email not verified!",
        userId: existingUser._id,
        emailVerification: existingUser.emailVerified,
      });

      const verificationEmailToken: ITokenBase | null = await generateToken(
        existingUser.email as string,
        TokenTypes.VERIFICATION
      );
      if (!verificationEmailToken) {
        Logger.error({
          message: "Failed to generate token!",
          userId: existingUser._id,
          token: verificationEmailToken,
        });
        return { error: "Failed to generate token!" };
      }

      Logger.debug({
        message: "Email verification token!",
        userId: existingUser._id,
        tokenId: verificationEmailToken._id,
      });

      // TODO: send email verification mail
      // await sendVerificationEmail(
      //   verificationToken.email,
      //   verificationToken.token,
      // );

      Logger.info({
        message: "Verification email sent!",
        userId: existingUser._id,
        tokenId: verificationEmailToken._id,
      });
      return { success: "Verification email sent!" };
    }

    if (existingUser.email && existingUser.twoFactorAuthentication) {
      Logger.debug({
        message: "User 2FA enabled!",
        userId: existingUser._id,
      });

      if (code) {
        Logger.debug({
          message: "2FA code found!",
          userId: existingUser._id,
          code: code,
        });

        const twoFactorToken: ITokenBase | null = await getTokenByEmail(
          existingUser.email as string,
          TokenTypes["2FA"]
        );
        if (!twoFactorToken) {
          Logger.error({
            message: "Two factor token not found!",
            userId: existingUser._id,
            twoFactorToken: twoFactorToken,
          });
          return { error: "Two factor token not found!" };
        }

        Logger.debug({
          message: "2FA token!",
          userId: existingUser._id,
          twoFactorToken: twoFactorToken,
        });

        if (twoFactorToken.details.code !== code) {
          Logger.error({
            message: "Invalid 2FA Code!",
            userId: existingUser._id,
            tokenId: twoFactorToken._id,
            code: code,
          });
          return { error: "Invalid 2FA Code!" };
        }

        const hasExpired =
          new Date(twoFactorToken.expiresAt as number) < new Date();
        if (hasExpired) {
          Logger.error({
            message: "Code expired!",
            userId: existingUser._id,
            tokenId: twoFactorToken._id,
            expiredBeforMS: hasExpired,
          });
          return { error: "Code expired!" };
        }

        const tokenDeleted: ITokenBase | null = await deletTokenById(
          twoFactorToken._id
        );
        if (!tokenDeleted) {
          Logger.warn({
            message: "Failed to delete 2FA token!",
            userId: existingUser._id,
            tokenId: twoFactorToken._id,
          });
          return { error: "Failed to delete 2FA token!" };
        }
      } else {
        const code: string = crypto.randomInt(1_00_000, 9_99_999).toString();
        Logger.debug({
          message: "2FA code not found!",
          userId: existingUser._id,
          newCode: code,
        });

        const verification2FAToken: ITokenBase | null = await generateToken(
          existingUser.email as string,
          TokenTypes["2FA"],
          {
            code: code,
          }
        );
        if (!verification2FAToken) {
          Logger.error({
            message: "Failed to generate 2FA token!",
            userId: existingUser._id,
            token: verification2FAToken,
          });
          return { error: "Failed to generate 2FA token!" };
        }

        Logger.debug({
          message: "2FA token generated!",
          userId: existingUser._id,
          token: verification2FAToken,
        });

        const isEMailSent: boolean = await send2FAEmail(
          verification2FAToken.email as string,
          verification2FAToken.details.code as string
        );
        if (!isEMailSent) {
          Logger.error({
            message: "Failed to send email!",
            userId: existingUser._id,
            tokenId: verification2FAToken._id,
          });
          return { error: "Failed to send email!" };
        }

        Logger.info({
          message: "2FA email send successfully!",
          userId: existingUser._id,
          tokenId: verification2FAToken._id,
          isEMailSent: isEMailSent,
        });
        return { twoFactor: true };
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    Logger.fatal({
      message: "login catch!",
      error: (error as Error).message,
    });

    let errorMessage: string;
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          errorMessage = "Invalid credentials!";
        case "AuthorizedCallbackError":
          errorMessage = "Access denied!";
        default:
          errorMessage = "Something went wrong!";
      }
      return { error: errorMessage };
    }

    throw error;
  }
};
