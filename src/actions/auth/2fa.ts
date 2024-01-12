"use server";

import * as z from "zod";
import { TwoFactorAuthSchema } from "@/schemas";
import Temporary, { ITemporaryBase } from "@/lib/model/temporary";

const getTemporaryDetails = async (uuid: String | null) => {
  try {
    const tempData: ITemporaryBase | null = await Temporary.findOne({
      uuid: uuid,
    });
    if (tempData === null) {
      return { error: "Invalid temporary data" };
    }
    console.log("🚀 ~ tempData:", tempData);

    return tempData;
  } catch (error) {
    console.log("🚀 ~ saveTemporaryDetails ~ error:", error);
  }
};

export const twoFactorAuth = async (
  uuid: string | null,
  values: z.infer<typeof TwoFactorAuthSchema>
) => {
  try {
    const validatedFields = TwoFactorAuthSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const tmpData: any = await getTemporaryDetails(uuid);
    if (values.code !== tmpData.details.code) {
      return { error: "Invalid code!" };
    }

    return {
      success: "Code verify successful!",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: (error as Error).message };
  }
};
