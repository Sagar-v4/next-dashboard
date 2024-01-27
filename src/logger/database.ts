import tracer from "tracer";

import { logger } from "@/config/env";
import Logs, { ILogsBase } from "@/lib/model/logs";

export const saveLogInDatabase = async (data: tracer.Tracer.LogOutput) => {
  if (logger.DATABASE_LOG !== "true") return;

  const log: ILogsBase | null = await Logs.create({
    title: data.title,
    file: data.file,
    method: data.method,
    line: data.line,
    message: data.message,
    timestamp: new Date(data.timestamp),
  });

  if (!log) {
    throw Error("Could not save log");
  }
};
