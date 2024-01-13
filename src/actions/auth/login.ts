"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { authLinks } from "@/config/site";
import Temporary from "@/lib/model/temporary";
import { temporaryTypes } from "@/constants/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import User, { IUserBase } from "@/lib/model/user";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

const send2FAMail = async (
  code: string,
  values: z.infer<typeof LoginSchema>
) => {
  try {
    return await sendSMTPMail({
      to: values.email,
      name: "`${values.firstName} ${values.lastName}`",
      subject: "Two Factor Authentication",
      body: `<p>Your 2FA Code is: <strong>${code}</strong></p>`,
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

const getUser = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const user: IUserBase | null = await User.findOne({ email: values.email });
    if (user === null) {
      return null; // { error: "Email is not registered!" };
    }
    const isPasswordMatching: boolean = user.compareHash(values.password);
    console.log("🚀 ~ getUser ~ isPasswordMatching:", isPasswordMatching);

    if (isPasswordMatching) {
      return user;
    }
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error);
  }
};

const saveTemporaryDetails = async (uuid: string, values: any) => {
  try {
    const tempData = new Temporary({
      uuid: uuid,
      type: temporaryTypes["2FA"],
      details: values,
      expiresAt: Date.now(),
    });

    await tempData.save();
  } catch (error) {
    console.log("🚀 ~ saveTemporaryDetails ~ error:", error);
  }
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    const user: any = await getUser(values);
    console.log("🚀 ~ login ~ user:", user);

    if (!user) {
      return { error: "Invalid email or password!!" };
    }

    if (user.twoFactorAuthentication) {
      const uuid: string = uuidv4();
      console.log("🚀 ~ login ~ uuid:", uuid);
      const code: string = String(Math.floor(100000 + Math.random() * 900000));
      await saveTemporaryDetails(uuid, { code: code, email: user.email });

      const isMailSent = await send2FAMail(code, values);
      const TwoFactorAuthLink: any = `${authLinks.twoFactorAuth.href}?id=${uuid}`;

      if (!isMailSent) {
        return { error: "Failed to send email!!" };
      }
      return {
        success: "2FA Verification email sent!",
        TwoFactorAuthLink: TwoFactorAuthLink,
      };
    }

    return {
      success: "Creadentials verified succesfully!",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
