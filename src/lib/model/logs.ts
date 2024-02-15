import { Document, model, models, Schema, Types } from "mongoose";

const logsSchema = new Schema(
  {
    title: { type: String, required: true },
    file: { type: String, required: true },
    method: { type: String, required: true },
    line: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

export interface ILogsSchema extends Document {
  _id?: Types.ObjectId;
  title: String;
  file: String;
  method: String;
  line: String;
  message: String;
  timestamp: Date;
}

// TODO: create function to fetch trace id and store in another field traceId
// logsSchema.pre("save", function (next) {
//   if (!this.roles.length) {
//     this.roles.push(userRoles.USER);
//   }
//   next();
// });

export interface ILogsBase extends ILogsSchema {}

const Logs = models?.Logs || model<ILogsBase>("Logs", logsSchema);

export default Logs;
