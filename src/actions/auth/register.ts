"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
import { authLinks } from "@/config/site";
import { IUserBase } from "@/lib/model/user";
import { generateToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { RegisterSchema } from "@/schemas/auth";
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
    Logger.trace({
      message: "Entering into register function",
      origin: origin,
      values: values,
    });

    const validatedFields: registrationType = RegisterSchema.safeParse(values);
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

    const { email, firstName, lastName } = validatedFields.data;
    const userName: string = `${firstName} ${lastName}`;

    const existingUser: IUserBase | null = await getUserByEmail(email);
    if (existingUser) {
      Logger.error({
        message: "Email already in use!",
        userId: existingUser._id,
      });
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
      Logger.error({
        message: "Failed to generate registration token!",
        token: registrationToken,
      });
      return { error: "Failed to generate registration token!" };
    }

    Logger.debug({
      message: "Registration details!",
      registrationId: registrationToken._id,
    });

    const createPasswordLink: string = `${origin}${authLinks.create.href}?token=${registrationToken.token}`;
    Logger.debug({
      message: "Create password link!",
      registrationId: registrationToken._id,
      createPasswordLink: createPasswordLink,
    });

    const isEMailSent: boolean = await sendRegistrationEmail(
      registrationToken.email as string,
      createPasswordLink
    );
    if (!isEMailSent) {
      Logger.error({
        message: "Failed to send email!",
        registrationId: registrationToken._id,
        isEMailSent: isEMailSent,
      });
      return { error: "Failed to send email!" };
    }

    Logger.info({
      message: "Registration email sent!",
      registrationId: registrationToken._id,
      isEMailSent: isEMailSent,
    });
    return { success: "Registration email sent!" };
  } catch (error) {
    Logger.fatal({
      message: "register catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};
