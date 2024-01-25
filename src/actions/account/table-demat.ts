"use server";

import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";

export const getDematAccounts = async (id: string) => {
  try {
    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      return undefined;
    }

    return existingUser.brokers ?? undefined;
  } catch (error) {
    return undefined;
  }
};

export const deleteDematAccount = async (userId: string, brokerId: string) => {
  try {
    const existingUser: IUserBase | null = await getUserById(userId);
    if (!existingUser) {
      return { error: "User doesn't exist!" };
    }

    // Checking ObjectId != String hend {!=} only
    existingUser.brokers = existingUser.brokers?.filter(
      (broker: any) => broker._id != brokerId
    );

    await existingUser.save();
    return { success: "Demat account deleted!" };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
