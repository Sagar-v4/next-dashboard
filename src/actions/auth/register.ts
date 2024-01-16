"use server";

import * as z from "zod";
import { authLinks } from "@/config/site";
import { RegisterSchema } from "@/schemas";
import { IUserBase } from "@/lib/model/user";
import { generateToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { sendRegistrationEmail } from "@/helper/smtp-email";

type registrationType = z.SafeParseReturnType<
  {
    email: string;
    firstName: string;
    lastName: string;
  },
  {
    email: string;
    firstName: string;
    lastName: string;
  }
>;

export const register = async (
  origin: string,
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedFields: registrationType = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, firstName, lastName } = validatedFields.data;
    const userName: string = `${firstName} ${lastName}`;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const registrationToken: ITokenBase | null = await generateToken(
      email,
      TokenTypes.REGISTRATION,
      {
        name: userName,
      }
    );
    if (!registrationToken) {
      return { error: "Failed to generate token!" };
    }

    const createPasswordLink: string = `${origin}${authLinks.create.href}?token=${registrationToken.token}`;
    const isEMailSent: boolean = await sendRegistrationEmail(
      registrationToken.email as string,
      createPasswordLink
    );
    if (!isEMailSent) {
      return { error: "Failed to send email!" };
    }

    return { success: "Registration email sent!" };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
