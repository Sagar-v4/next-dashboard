import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/data/token";
import Token, { ITokenBase } from "@/lib/model/token";
import { TokenTypes } from "@/constants/auth";

export const generateVerificationToken = async (
  email: string,
  details?: Object
): Promise<ITokenBase | null> => {
  try {
    const token: string = uuidv4();
    const expires: Date = new Date(new Date().getTime() + 3600 * 1000); // 1hr

    const existingToken: ITokenBase | null =
      await getVerificationTokenByEmail(email);

    if (existingToken) {
      await Token.findByIdAndDelete(existingToken._id);
    }

    const verficationToken: ITokenBase | null = await Token.create({
      email: email,
      token: token,
      type: TokenTypes.VERIFICATION,
      details: details,
      expiresAt: expires,
    });

    return verficationToken;
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return null;
  }
};
