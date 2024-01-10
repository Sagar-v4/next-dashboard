"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { ResetSchema } from "@/schemas";
import { authLinks } from "@/config/site";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

const sendResetPasswordMail = async (
  values: z.infer<typeof ResetSchema>,
  createPasswordLink: string
) => {
  return await sendSMTPMail({
    to: values.email,
    name: "`${values.firstName} ${values.lastName}`",
    subject: "Forgot Password",
    body: `<a href="${createPasswordLink}">click here</a> to get started`,
  });
};

export const reset = async (
  values: z.infer<typeof ResetSchema>,
  origin: string
) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const uuid = uuidv4();
  const createPasswordLink = `${origin}${authLinks.create.href}/${uuid}`;
  const isMailSent = await sendResetPasswordMail(values, createPasswordLink);

  if (!isMailSent) {
    return { error: "Failed to send email!!" };
  }
  return { success: "Reset password email sent!" };
};
