"use server";

import * as z from "zod";
import Temporary, {
  ITemporarySchema,
  ITemporaryBase,
} from "@/lib/model/temporary";
import { CreatePasswordSchema } from "@/schemas";
import { temporaryTypes } from "@/constants/auth";
import User, { IUserBase } from "@/lib/model/user";

const registerUser = async (
  tempData: ITemporarySchema,
  values: z.infer<typeof CreatePasswordSchema>
) => {
  try {
    const user = new User({
      email: tempData.details?.email,
      firstName: tempData.details?.firstName,
      lastName: tempData.details?.lastName,
      isEmailVerified: Date.now(),
    });

    user.password = user.hashPassword(values.password);

    return await user.save();
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

const resetUserPassword = async (
  tempData: ITemporarySchema,
  values: z.infer<typeof CreatePasswordSchema>
) => {
  try {
    const user: IUserBase | null = await User.findOne({
      email: tempData.details.email,
    });
    console.log("🚀 ~ user:", user);
    if (user === null) {
      return;
    }

    user.password = user.hashPassword(values.password);

    return await user.save();
    // const hashedPassword = user?.hashPassword(tempData.details.password);
    // console.log("🚀 ~ hashedPassword:", hashedPassword)
    // await User.findByIdAndUpdate(user?._id, {
    //   password: hashedPassword,
    // });
    return !!user;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};

const getTemporaryDetails = async (
  uuid: String | null,
  values: z.infer<typeof CreatePasswordSchema>
) => {
  try {
    const tempData: ITemporaryBase | null = await Temporary.findOne({
      uuid: uuid,
    });
    if (tempData === null) {
      return { error: "Invalid temporary data" };
    }
    console.log("🚀 ~ tempData:", tempData);

    if (tempData.type === temporaryTypes.REGISTRATION) {
      await registerUser(tempData, values);
    } else if (tempData.type === temporaryTypes.FORGOT) {
      await resetUserPassword(tempData, values);
    }
  } catch (error) {
    console.log("🚀 ~ saveTemporaryDetails ~ error:", error);
  }
};

export const createPassword = async (
  uuid: string | null,
  values: z.infer<typeof CreatePasswordSchema>
) => {
  try {
    const validatedFields = CreatePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    await getTemporaryDetails(uuid, values);
    return { success: "Password created successfully!" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message };
  }
};
