"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { ResetSchema } from "@/schemas";
import { authLinks } from "@/config/site";
import Temporary from "@/lib/model/temporary";
import { temporaryTypes } from "@/constants/auth";
import User, { IUserBase } from "@/lib/model/user";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

const sendResetPasswordMail = async (
  values: z.infer<typeof ResetSchema>,
  createPasswordLink: string
) => {
  return await sendSMTPMail({
    to: values.email,
    name: "`${values.firstName} ${values.lastName}`",
    subject: "Forgot Password",
    body: `<a href="${createPasswordLink}">click here</a> to reset password`,
  });
};

// Check (email + trick) already exists in the database
const emailAlreadyExists = async (email: string): Promise<Boolean> => {
  try {
    const user: IUserBase | null = await User.findOne({
      email: email,
    });

    return !!user; // as boolean
  } catch (error) {
    console.log("🚀 ~ emailAlreadyExists ~ error:", error);
    return false;
  }
};

const saveTemporaryDetails = async (
  uuid: string,
  values: z.infer<typeof ResetSchema>
) => {
  try {
    const tempData = new Temporary({
      uuid: uuid,
      type: temporaryTypes.FORGOT,
      details: values,
      expiresAt: Date.now(),
    });

    await tempData.save();
  } catch (error) {
    console.log("🚀 ~ saveTemporaryDetails ~ error:", error);
  }
};

export const reset = async (
  values: z.infer<typeof ResetSchema>,
  origin: string
) => {
  try {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const isEmailExist = await emailAlreadyExists(values.email);
    if (!isEmailExist) {
      return { error: "Email not found!" };
    }

    const uuid = uuidv4();
    await saveTemporaryDetails(uuid, values);

    const createPasswordLink = `${origin}${authLinks.create.href}?id=${uuid}`;
    const isMailSent = await sendResetPasswordMail(values, createPasswordLink);
    if (!isMailSent) {
      return { error: "Failed to send email!!" };
    }

    return { success: "Reset password email sent!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message };
  }
};
