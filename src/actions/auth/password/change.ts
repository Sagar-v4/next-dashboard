"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
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
    Logger.trace({
      message: "Entering into changePassword function",
      values: values,
    });

    const validatedFields: ChangePasswordType =
      ChangePasswordSchema.safeParse(values);
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

    const { id, currentPassword, newPassword } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      Logger.error({
        message: "User doesn't exist!",
        user: existingUser,
      });
      return { error: "User doesn't exist!" };
    }

    Logger.debug({
      message: "User details!",
      userId: existingUser._id,
    });

    const passwordMatch = existingUser.compareHash(currentPassword);
    if (!passwordMatch) {
      Logger.error({
        message: "Incorrect current password!",
        userId: existingUser._id,
      });
      return { error: "Incorrect current password!" };
    }

    Logger.debug({
      message: "Password matched!",
      userId: existingUser._id,
    });

    existingUser.password = existingUser.hashPassword(newPassword);
    await existingUser.save();

    Logger.info({
      message: "Password updated!",
      userId: existingUser._id,
    });
    return { success: "Password updated!" };
  } catch (error) {
    Logger.fatal({
      message: "changePassword catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message as string };
  }
};
