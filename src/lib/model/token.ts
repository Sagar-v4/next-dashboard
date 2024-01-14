import { Document, model, models, Schema, Types } from "mongoose";
import { TokenTypes } from "@/constants/auth";

const tokenSchema: Schema = new Schema({
  type: { type: String, enum: Object.values(TokenTypes), required: true },
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Number, required: true },
});

export interface ITokenSchema extends Document {
  _id: Types.ObjectId;
  type: String;
  email: String;
  token: String;
  details?: any | Object;
  createdAt: Date;
  expiresAt: Number;
}

export interface ITokenBase extends ITokenSchema {
  // TODO: add functions in future versions
}

const Token = models?.Token || model<ITokenBase>("Token", tokenSchema);

export default Token;
