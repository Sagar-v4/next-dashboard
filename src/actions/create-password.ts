"use server";

import * as z from "zod";
import { CreatePasswordSchema } from "@/schemas";

export const createPassword = async (
  values: z.infer<typeof CreatePasswordSchema>
) => {
  const validatedFields = CreatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Password created successfully!" };
};
