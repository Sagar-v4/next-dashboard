"use server";

import * as z from "zod";

import { Logger } from "@/logger/logger";
import { getUserById } from "@/data/user";
import { IUserBase } from "@/lib/model/user";
import { Brokers } from "@/constants/account";
import { NewDematAccountSchema } from "@/schemas/accounts";
// import { decrypt, encrypt } from "@/utils/crypto";

type dematAccountType = z.SafeParseReturnType<
  {
    id: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    broker: z.ZodString;
  },
  {
    id: string;
    name: string;
    code: string;
    broker: string;
  }
>;

export const addDematAccount = async (
  values: z.infer<typeof NewDematAccountSchema>
) => {
  try {
    Logger.trace({
      message: "Entering into register function",
      origin: origin,
      values: values,
    });

    const validatedFields: dematAccountType =
      NewDematAccountSchema.safeParse(values);
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

    const { id, broker, name, code } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
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

    if (!Object.values(Brokers).includes(broker as Brokers)) {
      Logger.error({
        message: "Invalid broker!",
        userId: existingUser._id,
        broker: broker,
      });
      return { error: "Invalid broker!" };
    }

    // TODO: Encrypt & decrypt code
    // console.log("🚀 ~ code:", code)
    // const encrypted = encrypt(code);
    // const decrypted = decrypt(code);
    // console.log("🚀 ~ encrypted:", encrypted)
    // console.log("🚀 ~ decrypted:", decrypted)

    if (existingUser.brokers) {
      let errorMsg: string = "";
      for (const existingBroker of existingUser.brokers as any) {
        if (existingBroker.name === name) {
          errorMsg = "Name already exists!";
          break;
        }
        if (existingBroker.code === code) {
          errorMsg = "Code already exists!";
          break;
        }
      }
      if (errorMsg) {
        Logger.error({
          message: errorMsg,
          userId: existingUser._id,
          broker: broker,
        });
        return { error: errorMsg };
      }
    }

    existingUser.brokers?.push({
      name: name,
      code: code,
      broker: broker,
    } as any);
    await existingUser.save();

    Logger.info({
      message: "Broker added successfully!",
      userId: existingUser._id,
      broker: broker,
    });
    return {
      success: "Broker added successfully!",
    };
  } catch (error) {
    Logger.fatal({
      message: "addDematAccount catch!",
      error: (error as Error).message,
    });

    return { error: (error as Error).message };
  }
};
