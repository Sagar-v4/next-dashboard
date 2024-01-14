import User, { IUserBase } from "@/lib/model/user";
import { emailWithoutTagRegex } from "@/utils/regex";

export const getUserByEmail = async (
  email: string
): Promise<IUserBase | null> => {
  try {
    // const emailRegex: RegExp = emailWithoutTagRegex(email);
    const user: IUserBase | null = await User.findOne({
      email: email, //{ $regex: emailRegex },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (
  userId: string
): Promise<IUserBase | null> => {
  try {
    const user: IUserBase | null = await User.findById(userId);

    return user;
  } catch (error) {
    return null;
  }
};
