import { Document, model, models, Schema, Types } from "mongoose";

const brokerSchema: Schema = new Schema(
  {
    logo: { type: String, required: true },
    name: { type: String, required: true },
    siteUrl: { type: String, required: true },
    codeUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export interface IBrokerSchema extends Document {
  _id: Types.ObjectId;
  logo: String;
  name: String;
  siteUrl: String;
  codeUrl: String;
}

export interface IBrokerBase extends IBrokerSchema {
  // TODO: add functions in future versions
}

const Broker = models?.Broker || model<IBrokerBase>("Broker", brokerSchema);

export default Broker;

export const brokers = [
  {
    id: "fdsf",
    name: "ANGEL ONE",
    logo: "https://d2u8j8b25aupc8.cloudfront.net/assets/icons/logo.svg",
  },
  {
    id: "fdfdfsf",
    name: "DHAN",
    logo: "https://dhan.co/_next/static/media/Dhanlogo.8a85768d.svg",
  },
];
