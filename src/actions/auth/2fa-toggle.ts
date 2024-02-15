"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
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
    Logger.trace({
      message: "Entering into twoFactorToggle function",
      values: values,
    });

    const validatedFields: forgotType = TwoFactorToggleSchema.safeParse(values);
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

    const { id, toggle } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      Logger.error({
        message: "User doesn't exists!",
        user: existingUser,
      });
      return { error: "User doesn't exist!" };
    }

    Logger.debug({
      message: "User details!",
      userId: existingUser._id,
    });

    if (toggle) {
      existingUser.twoFactorAuthentication = new Date(Date.now());
    } else {
      existingUser.twoFactorAuthentication = undefined;
    }
    await existingUser.save();

    Logger.info({
      message: `Two factor authentication ${toggle ? "enabled" : "disabled"}!`,
      userId: existingUser._id,
      toggle: toggle ? "enabled" : "disabled",
      twoFA: existingUser.twoFactorAuthentication,
    });
    return {
      success: `Two factor authentication ${toggle ? "enabled" : "disabled"}!`,
      date: existingUser.twoFactorAuthentication,
    };
  } catch (error) {
    Logger.fatal({
      message: "twoFactorToggle catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};

export const get2FA = async (id: string) => {
  try {
    Logger.trace({
      message: "Entering into get2FA function",
      userId: id,
    });
    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      Logger.error({
        message: "User doesn't exists!",
        user: existingUser,
      });
      return undefined;
    }

    Logger.info({
      message: "2FA value!",
      userId: existingUser._id,
      twoFA: existingUser.twoFactorAuthentication,
    });

    return existingUser.twoFactorAuthentication;
  } catch (error) {
    Logger.fatal({
      message: "get2FA catch!",
      error: (error as Error).message,
    });

    return undefined;
  }
};
