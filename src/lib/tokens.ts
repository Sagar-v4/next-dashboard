import { v4 as uuidv4 } from "uuid";
import { TokenTypes } from "@/constants/auth";
import { getTokenByEmail } from "@/data/token";
import Token, { ITokenBase } from "@/lib/model/token";

export const generateToken = async (
  email: string,
  type: TokenTypes,
  details?: Object
): Promise<ITokenBase | null> => {
  try {
    const token: string = uuidv4();
    const expires: Date = new Date(new Date().getTime() + 3600 * 1000); // 1hr

    const existingToken: ITokenBase | null = await getTokenByEmail(email, type);
    if (existingToken) {
      await Token.findByIdAndDelete(existingToken._id);
    }

    const createdToken: ITokenBase | null = await Token.create({
      email: email,
      token: token,
      type: type,
      details: details,
      expiresAt: expires,
    });

    return createdToken;
  } catch (error) {
    return null;
  }
};
