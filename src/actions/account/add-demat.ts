"use server";

import * as z from "zod";

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
    const validatedFields: dematAccountType =
      NewDematAccountSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { id, broker, name, code } = validatedFields.data;

    const existingUser: IUserBase | null = await getUserById(id);
    if (!existingUser) {
      return { error: "User doesn't exist!" };
    }

    if (!Object.values(Brokers).includes(broker as Brokers)) {
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
        return { error: errorMsg };
      }
    }

    existingUser.brokers?.push({
      name: name,
      code: code,
      broker: broker,
    } as any);

    await existingUser.save();
    return {
      success: "Broker added successfully",
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
