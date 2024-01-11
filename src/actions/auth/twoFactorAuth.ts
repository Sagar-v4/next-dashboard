"use server";

import * as z from "zod";
import { TwoFactorAuthSchema } from "@/schemas";

export const twoFactorAuth = async (
  values: z.infer<typeof TwoFactorAuthSchema>
) => {
  const validatedFields = TwoFactorAuthSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return {
    success: "Code verification successful!",
  };
};
