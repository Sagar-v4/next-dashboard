"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { authLinks } from "@/config/site";
import { IUserBase } from "@/lib/model/user";
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
    const validatedFields: resetType = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "Email not found!" };
    }

    const resetToken: ITokenBase | null = await generateToken(
      email,
      TokenTypes.FORGOT
    );
    if (!resetToken) {
      return { error: "Failed to generate token!" };
    }

    const forgotPasswordLink = `${origin}${authLinks.create.href}?token=${resetToken?.token}`;
    const isEMailSent: boolean = await sendResetEmail(
      resetToken.email as string,
      forgotPasswordLink
    );
    if (!isEMailSent) {
      return { error: "Failed to send email!!" };
    }

    return { success: "Reset email sent!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message };
  }
};
