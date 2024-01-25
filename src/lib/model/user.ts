import bcrypt from "bcryptjs";
import { Document, model, models, Schema, Types } from "mongoose";

import { userRoles } from "@/constants/auth";
import { Brokers, TradeTypes } from "@/constants/account";

const brokerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    broker: { type: String, required: true, enum: Object.values(Brokers) },
    tradeType: [{ type: String, enum: Object.values(TradeTypes) }],
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
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
    brokers: [brokerSchema],
    accounts: { type: String, ref: "Account" },
  },
  { timestamps: true }
);

export interface IUserSchema extends Document {
  _id?: Types.ObjectId;
  name: String;
  email: String;
  emailVerified: Date;
  phone?: String;
  isPhoneVerified?: Date;
  twoFactorAuthentication?: Date;
  password?: String;
  accounts?: Array<Types.ObjectId>;
  roles: Array<String>;
  brokers?: Array<typeof brokerSchema>;
  createdAt: Date;
}

// TODO: make code encrypt and decrypt functionality
userSchema.methods.hashPassword = function (password: string): string {
  return bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return this.omit(this._doc, ["password", "__v"]);
};

userSchema.pre("save", function (next) {
  if (!this.roles.length) {
    this.roles.push(userRoles.USER);
  }
  next();
});

export interface IUserBase extends IUserSchema {
  hashPassword(password: string): string;
  compareHash(password: string): boolean;
  toPublicJSON(): IUserSchema;
}

const User = models?.User || model<IUserBase>("User", userSchema);

export default User;
