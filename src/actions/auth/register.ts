"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { authLinks } from "@/config/site";
import { RegisterSchema } from "@/schemas";
import Temporary from "@/lib/model/temporary";
import { temporaryTypes } from "@/constants/auth";
import User, { IUserBase } from "@/lib/model/user";
import { emailWithoutTagRegex } from "@/utils/regex";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

const sendRegistrationMail = async (
  values: z.infer<typeof RegisterSchema>,
  createPasswordLink: string
) => {
  try {
    return await sendSMTPMail({
      to: values.email,
      name: `${values.firstName} ${values.lastName}`,
      subject: "New Registration Verification",
      body: `<a href="${createPasswordLink}">click here</a> to get started`,
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

// Check (email + trick) already exists in the database
const emailAlreadyExists = async (email: string): Promise<Boolean> => {
  try {
    const emailRegex: RegExp = emailWithoutTagRegex(email);
    console.log("🚀 ~ emailAlreadyExists ~ emailRegex:", emailRegex);
    const user: IUserBase | null = await User.findOne({
      email: { $regex: emailRegex },
    });

    return !!user; // as boolean
  } catch (error) {
    console.log("🚀 ~ emailAlreadyExists ~ error:", error);
    return false;
  }
};

const saveTemporaryDetails = async (
  uuid: string,
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const tempData = new Temporary({
      uuid: uuid,
      type: temporaryTypes.REGISTRATION,
      details: values,
      expiresAt: Date.now(),
    });

    await tempData.save();
  } catch (error) {
    console.log("🚀 ~ saveTemporaryDetails ~ error:", error);
  }
};

export const register = async (
  origin: string,
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const isEmailExist = await emailAlreadyExists(values.email);
    if (isEmailExist) {
      return { error: "Email already taken!" };
    }

    const uuid = uuidv4();
    await saveTemporaryDetails(uuid, values);

    const createPasswordLink = `${origin}${authLinks.create.href}?id=${uuid}`;
    const isMailSent = await sendRegistrationMail(values, createPasswordLink);
    if (!isMailSent) {
      return { error: "Failed to send email!!" };
    }

    return { success: "Verification email sent!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message };
  }
};
