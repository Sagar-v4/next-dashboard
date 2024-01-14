import { TokenTypes } from "@/constants/auth";
import Token, { ITokenBase } from "@/lib/model/token";
import { emailWithoutTagRegex } from "@/utils/regex";

export const getVerificationTokenByEmail = async (
  email: string
): Promise<ITokenBase | null> => {
  try {
    const emailRegex: RegExp = emailWithoutTagRegex(email);
    const verificationToken: ITokenBase | null = await Token.findOne({
      email: { $regex: emailRegex },
      type: TokenTypes.VERIFICATION,
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (
  token: string
): Promise<ITokenBase | null> => {
  try {
    const verificationToken: ITokenBase | null = await Token.findOne({
      token: token,
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};
