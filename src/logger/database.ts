"use server";

import tracer from "tracer";

import { logger } from "@/config/env";
import Logs, { ILogsBase } from "@/lib/model/logs";
import { getLogDateFormat } from "@/utils/date-time";

export const setLogInDatabase = async (
  data: tracer.Tracer.LogOutput
): Promise<undefined> => {
  if (logger.DATABASE_LOG !== "true") return undefined;
  const log: ILogsBase | null = await Logs.create({
    title: data.title,
    file: data.file,
    method: data.method,
    line: data.line,
    message: data.message,
    timestamp: new Date(),
  });

  if (!log) {
    throw Error("Could not set log!");
  }
};

// TODO: {Warning: Only plain objects can be passed to Client Components from Server Components.}
export async function getLogFromDatabase(): Promise<any[] | undefined> {
  if (logger.DATABASE_LOG !== "true") return undefined;
  const logs = await Logs.find({ _id: { $exists: true } });
  const Loggers = logs.map((log) => {
    log._doc.timestamp = getLogDateFormat(new Date(log._doc.timestamp));
    return log._doc;
  });

  if (!Loggers) {
    throw Error("Could not get logs!");
  }
  return Loggers;
}
