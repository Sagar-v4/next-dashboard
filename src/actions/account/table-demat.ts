"use server";

import { Logger } from "@/logger/logger";
import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";

export const getDematAccounts = async (userId: string) => {
  try {
    Logger.trace({
      message: "Entering into getDematAccounts function",
      userId: userId,
    });
    const existingUser: IUserBase | null = await getUserById(userId);
    if (!existingUser) {
      Logger.error({
        message: "User doesn't exist!",
        userId: userId,
        existingUser: existingUser,
      });
      return undefined;
    }

    Logger.info({
      message: "Sending user brokers!",
      userId: userId,
      brokersLength: existingUser.brokers?.length,
    });
    return existingUser.brokers ?? undefined;
  } catch (error) {
    Logger.fatal({
      message: "getDematAccounts catch!",
      error: (error as Error).message,
    });

    return undefined;
  }
};

export const deleteDematAccount = async (userId: string, brokerId: string) => {
  try {
    Logger.trace({
      message: "Entering into deleteDematAccount function",
      userId: userId,
      brokerId: brokerId,
    });

    const existingUser: IUserBase | null = await getUserById(userId);
    if (!existingUser) {
      Logger.error({
        message: "User doesn't exist!",
        userId: userId,
        existingUser: existingUser,
      });
      return { error: "User doesn't exist!" };
    }

    // Checking ObjectId != String hend {!=} only
    existingUser.brokers = existingUser.brokers?.filter(
      (broker: any) => broker._id != brokerId
    );
    await existingUser.save();

    Logger.info({
      message: "Demat account deleted!",
      userId: userId,
      brokerId: brokerId,
    });
    return { success: "Demat account deleted!" };
  } catch (error) {
    Logger.fatal({
      message: "deleteDematAccount catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};
