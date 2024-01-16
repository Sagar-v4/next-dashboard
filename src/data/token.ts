import { DeleteResult, ObjectId } from "mongodb";
import { TokenTypes } from "@/constants/auth";
import { emailWithoutTagRegex } from "@/utils/regex";
import Token, { ITokenBase } from "@/lib/model/token";

export const getTokenByEmail = async (
  email: string,
  type: TokenTypes
): Promise<ITokenBase | null> => {
  try {
    const emailRegex: RegExp = emailWithoutTagRegex(email);
    const savedToken: ITokenBase | null = await Token.findOne({
      email: { $regex: emailRegex },
      type: type,
    });

    return savedToken;
  } catch (error) {
    return null;
  }
};

export const getTokenByToken = async (
  token: string
): Promise<ITokenBase | null> => {
  try {
    const savedToken: ITokenBase | null = await Token.findOne({
      token: token,
    });

    return savedToken;
  } catch (error) {
    return null;
  }
};

export const deletTokenById = async (
  tokenId: ObjectId
): Promise<ITokenBase | null> => {
  try {
    const deletedToken: ITokenBase | null =
      await Token.findByIdAndDelete(tokenId);

    return deletedToken;
  } catch (error) {
    return null;
  }
};

export const deleteTokenByToken = async (
  token: string
): Promise<DeleteResult | null> => {
  try {
    const deletedToken = await Token.deleteOne({
      token: token,
    });

    return deletedToken;
  } catch (error) {
    return null;
  }
};
