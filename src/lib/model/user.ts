import bcrypt from "bcryptjs";
import { Document, model, models, Schema, Types } from "mongoose";
import { IAccountBase } from "@/lib/model/account";
import { userRoles } from "@/constants/auth";

// import validator from "validator";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: { validator: validator.isEmail, message: "Invalid Email!" },
  },
  emailVerified: { type: Date },
  phone: { type: String },
  isPhoneVerified: { type: Date },
  twoFactorAuthentication: { type: Date },
  password: { type: String },
  roles: [
    {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
  ],
  accounts: { type: String, ref: "Account" },
  createdAt: { type: Date, default: Date.now },

  /**
  isPasswordAutogenerated: { type: Boolean, default: false },
  roles: [
    {
      org_id: { type: Types.ObjectId, ref: "Organisation" },
      role: { type: String },
    },
  ],
  isOrgDisabled: { type: Boolean, default: false },
  schema_version: { type: Number, default: 1 },
  is_consent_provided: { type: String },
  loginAttempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null },
   */
});

export interface IUserSchema extends Document {
  _id?: Types.ObjectId;
  firstName: String;
  lastName: String;
  email: String;
  emailVerified?: Date;
  phone?: String;
  isPhoneVerified?: Date;
  twoFactorAuthentication?: Date;
  password?: String;
  accounts: Array<Types.ObjectId>;
  roles: Array<String>;
  createdAt: Date;

  /**
  isPasswordAutogenerated?: boolean;
  roles: Array<IRole>;
  isOrgDisabled: boolean;
  createdAt: Date;
  schema_version: number;
  is_consent_provided: string;
  loginAttempts: number;
  blockedUntil: Date;
   */
}

userSchema.methods.hashPassword = function (password: string): string {
  return bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function (password: string): boolean {
  // @ts-ignore
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toPublicJSON = function () {
  // @ts-ignore
  return _.omit(this._doc, ["password", "__v"]);
};

// userSchema.pre("save", async function (next) {
//   if (!this.roles.length) {
//     this.roles.push(userRoles.USER);
//   }
//   next();
// });

export interface IUserBase extends IUserSchema {
  hashPassword(password: string): string;
  compareHash(password: string): boolean;
  toPublicJSON(): IUserSchema;
}

const User = models?.User || model<IUserBase>("User", userSchema);

export default User;
