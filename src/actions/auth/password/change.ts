"use server";

import * as z from "zod";

import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { ChangePasswordSchema } from "@/schemas/auth";

export type ChangePasswordType = z.SafeParseReturnType<
  {
    id: z.ZodString;
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
  },
  {
    id: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
>;

export type returnType = Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
    }
>;

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>
): returnType => {
  try {
    const validatedFields: ChangePasswordType =
      ChangePasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, currentPassword, newPassword } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "User doesn't exist!" };
    }

    const passwordMatch = existingUser.compareHash(currentPassword);
    if (!passwordMatch) {
      return { error: "Incorrect current password!" };
    }

    existingUser.password = existingUser.hashPassword(newPassword);
    await existingUser.save();

    return { success: "Password updated!" };
  } catch (error) {
    return { error: (error as Error).message as string };
  }
};
