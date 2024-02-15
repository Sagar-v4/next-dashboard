"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
import { authLinks } from "@/config/site";
import { IUserBase } from "@/lib/model/user";
import { ResetSchema } from "@/schemas/auth";
import { generateToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { sendResetEmail } from "@/helper/smtp-email";

type resetType = z.SafeParseReturnType<
  {
    email: string;
  },
  {
    email: string;
  }
>;

export const reset = async (
  origin: string,
  values: z.infer<typeof ResetSchema>
) => {
  try {
    Logger.trace({
      message: "Entering into reset function",
      origin: origin,
      values: values,
    });

    const validatedFields: resetType = ResetSchema.safeParse(values);
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

    const { email } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (!existingUser) {
      Logger.error({
        message: "Email not found!",
        user: existingUser,
      });
      return { error: "Email not found!" };
    }

    const resetToken: ITokenBase | null = await generateToken(
      email,
      TokenTypes.FORGOT
    );
    if (!resetToken) {
      Logger.error({
        message: "Failed to generate reset token!",
        userId: existingUser._id,
        token: resetToken,
      });
      return { error: "Failed to generate reset token!" };
    }

    Logger.debug({
      message: "Reset token details!",
      userId: existingUser._id,
      tokenId: resetToken._id,
    });

    const forgotPasswordLink = `${origin}${authLinks.create.href}?token=${resetToken.token}`;
    Logger.debug({
      message: "Forgot password link!",
      userId: existingUser._id,
      tokenId: resetToken._id,
      forgotPasswordLink: forgotPasswordLink,
    });

    const isEMailSent: boolean = await sendResetEmail(
      resetToken.email as string,
      forgotPasswordLink
    );
    if (!isEMailSent) {
      Logger.error({
        message: "Failed to send email!",
        userId: existingUser._id,
        tokenId: resetToken._id,
        isEMailSent: isEMailSent,
      });
      return { error: "Failed to send email!" };
    }

    Logger.error({
      message: "Reset email sent!",
      userId: existingUser._id,
      tokenId: resetToken._id,
      isEMailSent: isEMailSent,
    });
    return { success: "Reset email sent!" };
  } catch (error) {
    Logger.fatal({
      message: "reset catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};
