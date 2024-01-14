"use server";

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { TokenTypes } from "@/constants/auth";
import { ITokenBase } from "@/lib/model/token";
import { CreatePasswordSchema } from "@/schemas";
import User, { IUserBase } from "@/lib/model/user";
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
    const existingUser: IUserBase | null = await getUserByEmail(
      existingToken.email as string
    );
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const newUser: IUserBase | null = new User({
      email: existingToken.email,
      name: existingToken.details?.name as String,
      emailVerified: Date.now(),
    });
    if (!newUser) {
      return { error: "Failed to create user!" };
    }

    const { password } = validatedFields.data;
    newUser.password = newUser.hashPassword(password);
    await newUser.save();

    const tokenDeleted: ITokenBase | null = await deletTokenById(
      existingToken._id
    );
    if (!tokenDeleted) {
      return { error: "Failed to delete token!" };
    }

    return { success: "Password created successfully!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw error;
  }
};

const forgot = async (
  validatedFields: any,
  existingToken: ITokenBase
): returnType => {
  try {
    const existingUser: IUserBase | null = await getUserByEmail(
      existingToken.email as string
    );
    if (!existingUser) {
      return { error: "Email not found!" };
    }

    const { password } = validatedFields.data;
    existingUser.password = existingUser.hashPassword(password);
    await existingUser.save();

    const tokenDeleted: ITokenBase | null = await deletTokenById(
      existingToken._id
    );
    if (!tokenDeleted) {
      return { error: "Failed to delete token!" };
    }

    return { success: "Password reset successfully!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw error;
  }
};

export const createPassword = async (
  token: string | null,
  values: z.infer<typeof CreatePasswordSchema>
): returnType => {
  try {
    if (!token) {
      return { error: "Token missing!" };
    }

    const validatedFields: createPasswordType =
      CreatePasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const existingToken: ITokenBase | null = await getTokenByToken(
      token as string
    );
    if (!existingToken) {
      return { error: "Token doesn't exist!" };
    }

    const hasExpired: boolean =
      (existingToken.expiresAt as number) < new Date().getTime();
    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    switch (existingToken.type) {
      case TokenTypes.REGISTRATION:
        return await registration(validatedFields, existingToken);
      case TokenTypes.FORGOT:
        return await forgot(validatedFields, existingToken);
      default:
        return { error: "Invalid Token type!" };
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message as string };
  }
};
