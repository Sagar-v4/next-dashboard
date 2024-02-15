"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import User, { IUserBase } from "@/lib/model/user";
import { CreatePasswordSchema } from "@/schemas/auth";
import { deletTokenById, getTokenByToken } from "@/data/token";

export type createPasswordType = z.SafeParseReturnType<
  {
    password: string;
    confirmPassword: string;
  },
  {
    password: string;
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

const registration = async (
  validatedFields: any,
  existingToken: ITokenBase
): returnType => {
  try {
    Logger.trace({
      message: "Entering into registration function",
      validatedFields: validatedFields,
      existingTokenId: existingToken._id,
    });

    const existingUser: IUserBase | null = await getUserByEmail(
      existingToken.email as string
    );
    if (existingUser) {
      Logger.error({
        message: "Email already in use!",
        userId: existingUser._id,
      });
      return { error: "Email already in use!" };
    }

    Logger.debug({
      message: "User details!",
      userId: existingUser,
    });

    const newUser: IUserBase | null = new User({
      email: existingToken.email,
      name: existingToken.details?.name as String,
      emailVerified: Date.now(),
    });
    if (!newUser) {
      Logger.error({
        message: "Failed to create user!",
        newUser: newUser,
      });
      return { error: "Failed to create user!" };
    }

    const { password } = validatedFields.data;
    newUser.password = newUser.hashPassword(password);
    const newCreatedUser = await newUser.save();

    Logger.debug({
      message: "New user details!",
      newUserId: newCreatedUser._id,
    });

    const tokenDeleted: ITokenBase | null = await deletTokenById(
      existingToken._id
    );
    if (!tokenDeleted) {
      Logger.warn({
        message: "Failed to delete token!",
        tokenId: existingToken._id,
        tokenDeleted: tokenDeleted,
      });
      return { error: "Failed to delete token!" };
    }

    Logger.info({
      message: "Password created successfully!",
      userId: newCreatedUser._id,
    });
    return { success: "Password created successfully!" };
  } catch (error) {
    Logger.fatal({
      message: "registration catch!",
      error: (error as Error).message,
    });

    throw error;
  }
};

const forgot = async (
  validatedFields: any,
  existingToken: ITokenBase
): returnType => {
  try {
    Logger.trace({
      message: "Entering into forgot function",
      validatedFields: validatedFields,
      existingTokenId: existingToken._id,
    });

    const existingUser: IUserBase | null = await getUserByEmail(
      existingToken.email as string
    );
    if (!existingUser) {
      Logger.error({
        message: "Email not found!",
        existingUser: existingUser,
      });
      return { error: "Email not found!" };
    }

    const { password } = validatedFields.data;
    existingUser.password = existingUser.hashPassword(password);
    await existingUser.save();

    Logger.debug({
      message: "Password updated!",
      userId: existingUser._id,
    });

    const tokenDeleted: ITokenBase | null = await deletTokenById(
      existingToken._id
    );
    if (!tokenDeleted) {
      Logger.warn({
        message: "Failed to delete token!",
        userId: existingUser._id,
        tokenDeleted: tokenDeleted,
      });
      return { error: "Failed to delete token!" };
    }

    Logger.info({
      message: "Password reset successfully!",
      userId: existingUser._id,
    });
    return { success: "Password reset successfully!" };
  } catch (error) {
    Logger.fatal({
      message: "forgot catch!",
      error: (error as Error).message,
    });

    throw error;
  }
};

export const createPassword = async (
  token: string | null,
  values: z.infer<typeof CreatePasswordSchema>
): returnType => {
  try {
    Logger.trace({
      message: "Entering into createPassword function",
      token: token,
      values: values,
    });

    if (!token) {
      Logger.error({
        message: "Token missing!",
        token: token,
      });
      return { error: "Token missing!" };
    }

    const validatedFields: createPasswordType =
      CreatePasswordSchema.safeParse(values);
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

    const existingToken: ITokenBase | null = await getTokenByToken(
      token as string
    );
    if (!existingToken) {
      Logger.error({
        message: "Token doesn't exist!",
        token: existingToken,
      });
      return { error: "Token doesn't exist!" };
    }

    Logger.debug({
      message: "Token details!",
      tokenId: existingToken._id,
    });

    const hasExpired: boolean =
      (existingToken.expiresAt as number) < new Date().getTime();
    if (hasExpired) {
      Logger.error({
        message: "Token has expired!",
        tokenId: existingToken._id,
        expiredBeforMS: hasExpired,
      });
      return { error: "Token has expired!" };
    }

    switch (existingToken.type) {
      case TokenTypes.REGISTRATION:
        return await registration(validatedFields, existingToken);
      case TokenTypes.FORGOT:
        return await forgot(validatedFields, existingToken);
      default:
        Logger.warn({
          message: "Invalid Token type!",
          tokenId: existingToken._id,
          tokenType: existingToken.type,
        });
        return { error: "Invalid Token type!" };
    }
  } catch (error) {
    Logger.fatal({
      message: "createPassword catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message as string };
  }
};
