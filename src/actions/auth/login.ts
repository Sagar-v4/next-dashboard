"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { LoginSchema } from "@/schemas";
import { authLinks } from "@/config/site";
import { sendSMTPMail } from "@/lib/relay/email/smtp-email";

const send2FAMail = async (
  values: z.infer<typeof LoginSchema>,
  code: string
) => {
  return await sendSMTPMail({
    to: values.email,
    name: "`${values.firstName} ${values.lastName}`",
    subject: "Two Factor Authentication",
    body: `<p>Your 2FA Code is: <strong>${code}</strong></p>`,
  });
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const uuid = uuidv4();
  const code = "123456";
  const isMailSent = await send2FAMail(values, code);
  const TwoFactorAuthLink: any = `${authLinks.twoFactorAuth.href}/${uuid}`;

  if (!isMailSent) {
    return { error: "Failed to send email!!" };
  }

  return {
    success: "Confirmation email sent!",
    TwoFactorAuthLink: TwoFactorAuthLink,
  };
};
