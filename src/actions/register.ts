"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "@/lib/mail";
import { RegisterSchema } from "@/schemas";

const sendRegistrationMail = async (
  values: z.infer<typeof RegisterSchema>,
  createPasswordLink: string
) => {
  return await sendMail({
    to: values.email,
    name: `${values.firstName} ${values.lastName}`,
    subject: "New Registration Verification",
    body: `<a href="${createPasswordLink}">click here</a> to get started`,
  });
};

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  origin: string
) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const uuid = uuidv4();
  const createPasswordLink = `${origin}/create-password/${uuid}`;
  const isMailSent = await sendRegistrationMail(values, createPasswordLink);

  if (!isMailSent) {
    return { error: "Failed to send email!!" };
  }
  return { success: "Confirmation email sent!" };
};
