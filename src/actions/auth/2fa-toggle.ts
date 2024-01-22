"use server";

import * as z from "zod";

import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { TwoFactorToggleSchema } from "@/schemas/auth";

type forgotType = z.SafeParseReturnType<
  {
    id: z.ZodString;
    toggle: z.ZodBoolean;
  },
  {
    id: string;
    toggle: boolean;
  }
>;

export const twoFactorToggle = async (
  values: z.infer<typeof TwoFactorToggleSchema>
) => {
  try {
    const validatedFields: forgotType = TwoFactorToggleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, toggle } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      return { error: "User doesn't exist!" };
    }

    if (toggle) {
      existingUser.twoFactorAuthentication = new Date(Date.now());
    } else {
      existingUser.twoFactorAuthentication = undefined;
    }
    await existingUser.save();

    return {
      success: `Two factor authentication ${toggle ? "enabled" : "disabled"}!`,
      date: existingUser.twoFactorAuthentication,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const get2FA = async (id: string) => {
  try {
    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      return undefined;
    }

    return existingUser.twoFactorAuthentication ?? undefined;
  } catch (error) {
    return undefined;
  }
};
