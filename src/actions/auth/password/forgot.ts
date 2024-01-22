"use server";

import * as z from "zod";

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
    const validatedFields: forgotType = ForgotPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, email } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      return { error: "User doesn't exist!" };
    }

    const resetToken: ITokenBase | null = await generateToken(
      existingUser.email as string,
      TokenTypes.FORGOT
    );
    if (!resetToken) {
      return { error: "Failed to generate token!" };
    }

    const forgotPasswordLink = `${origin}${authLinks.create.href}?token=${resetToken.token}`;
    // TODO: create send link for sms & whatsapp as well
    if (email) {
      const isEMailSent: boolean = await sendResetEmail(
        resetToken.email as string,
        forgotPasswordLink
      );
      if (!isEMailSent) {
        return { error: "Failed to send email!!" };
      }
    }

    return { success: "Forgot password link sent!" };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
