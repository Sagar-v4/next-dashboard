import { Document, model, models, Schema, Types } from "mongoose";
import { temporaryTypes } from "@/constants/auth";

const temporarySchema: Schema = new Schema({
  uuid: { type: String, unique: true, required: true },
  type: { type: String, enum: Object.values(temporaryTypes), required: true },
  details: { type: Object, required: true },
  expiresAt: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

export interface ITemporarySchema extends Document {
  _id: Types.ObjectId;
  uuid: String;
  type: String;
  details: Object | any;
  createdAt: Date;
  expiresAt: Number;
}

export interface ITemporaryBase extends ITemporarySchema {
  // TODO: add functions in future versions
}

const Temporary =
  models.Temporary || model<ITemporaryBase>("Temporary", temporarySchema);

export default Temporary;
