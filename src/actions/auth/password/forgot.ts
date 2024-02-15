"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
import { authLinks } from "@/config/site";
import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { generateToken } from "@/lib/tokens";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { sendResetEmail } from "@/helper/smtp-email";
import { ForgotPasswordSchema } from "@/schemas/auth";

type forgotType = z.SafeParseReturnType<
  {
    id: z.ZodString;
    email: z.ZodBoolean;
    sms: z.ZodOptional<z.ZodBoolean>;
    whatsapp: z.ZodOptional<z.ZodBoolean>;
  },
  {
    id: string;
    email: boolean;
    sms?: boolean | undefined;
    whatsapp?: boolean | undefined;
  }
>;

export const forgotPassword = async (
  origin: string,
  values: z.infer<typeof ForgotPasswordSchema>
) => {
  try {
    Logger.trace({
      message: "Entering into forgotPassword function",
      origin: origin,
      values: values,
    });

    const validatedFields: forgotType = ForgotPasswordSchema.safeParse(values);
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

    const { id, email } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
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

    const resetToken: ITokenBase | null = await generateToken(
      existingUser.email as string,
      TokenTypes.FORGOT
    );
    if (!resetToken) {
      Logger.error({
        message: "Failed to generate token!",
        userId: existingUser._id,
        token: resetToken,
      });
      return { error: "Failed to generate token!" };
    }

    const forgotPasswordLink = `${origin}${authLinks.create.href}?token=${resetToken.token}`;
    Logger.debug({
      message: "Forgot password link!",
      userId: existingUser._id,
      forgotPasswordLink: forgotPasswordLink,
    });

    // TODO: create send link for sms & whatsapp as well
    if (email) {
      Logger.debug({
        message: "Sending forgot password link to email!",
        userId: existingUser._id,
      });

      const isEMailSent: boolean = await sendResetEmail(
        resetToken.email as string,
        forgotPasswordLink
      );
      if (!isEMailSent) {
        Logger.debug({
          message: "Failed to send email!",
          userId: existingUser._id,
          isEMailSent: isEMailSent,
        });
        return { error: "Failed to send email!" };
      }

      Logger.info({
        message: "Forgot password link sent to email!",
        userId: existingUser._id,
        isEMailSent: isEMailSent,
      });
    }

    Logger.info({
      message: "Forgot password link sent!",
      userId: existingUser._id,
    });
    return { success: "Forgot password link sent!" };
  } catch (error) {
    Logger.fatal({
      message: "forgotPassword catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};
