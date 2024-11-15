import { Document, model, models, Schema, Types } from "mongoose";

const accountSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User" },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: Types.ObjectId, required: true },
  refreshToken: { type: String },
  accessToken: { type: String },
  expires_at: { type: Number },
  tokenType: { type: String },
  scope: { type: String },
  idToken: { type: String },
  sessionState: { type: String },
  createdAt: { type: Date, default: Date.now },

  /**
  roles: [
    {
      org_id: { type: Types.ObjectId, ref: "Organisation" },
      role: { type: String },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: validator.isEmail, message: "Invalid Email!" },
  },
  isEmailVerified: { type: Date, default: null },
  phone: { type: String, default: null },
  isPhoneVerified: { type: Date, default: null },
  password: { type: String },
  isPasswordAutogenerated: { type: Boolean, default: false },

  isOrgDisabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  schema_version: { type: Number, default: 1 },
  is_consent_provided: { type: String },
  loginAttempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null },
  */
});

export interface IAccountSchema extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: String;
  provider: String;
  providerAccountId: Types.ObjectId;
  refreshToken?: String;
  accessToken?: String;
  expiresAt?: Number;
  tokenType?: String;
  scope?: String;
  idToken?: String;
  sessionState?: String;
  createdAt: Date;

  /**
  email: string;
  isEmailVerified: boolean;
  phone?: string;
  isPhoneVerified: boolean;
  password: string;
  isPasswordAutogenerated?: boolean;
  roles: Array<IRole>;
  isOrgDisabled: boolean;
  schema_version: number;
  is_consent_provided: string;
  loginAttempts: number;
  blockedUntil: Date; */
}

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export interface IAccountBase extends IAccountSchema {
  // TODO: add functions in future versions
}

const Account =
  models?.Account || model<IAccountBase>("Account", accountSchema);

export default Account;
