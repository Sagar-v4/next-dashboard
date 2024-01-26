import fs from "fs";
import tracer from "tracer";
import colors from "colors";

import { logger } from "@/config/env";

const printLogOnConsole = (data: tracer.Tracer.LogOutput) => {
  console.log(data.output);
};

const saveLogInLocal = (data: tracer.Tracer.LogOutput) => {
  if (logger.LOCAL_LOG !== "true") return;

  fs.createWriteStream(logger.LOG_FILE_NAME, {
    flags: "a",
    encoding: "utf8",
    mode: 0o666,
  }).write(
    `${data.timestamp},${data.title},${data.file},${data.method},${data.line},"${data.message}"\n`
  );
};

// TODO: add logs in db
const saveLogInDatabase = (data: tracer.Tracer.LogOutput) => {
  if (logger.DATABASE_LOG !== "true") return;
  console.log("🚀 ~ saveLogInDatabase ~ data:", data);
};

const preProcessingData = (data: tracer.Tracer.LogOutput): void => {
  data.title = data.title.toUpperCase();
};

export const Logger = tracer.colorConsole({
  level: logger.LOG_LEVEL,
  format:
    "[{{timestamp}}] {{title}}\n{{file}} | {{method}} | {{line}}\n{{message}}",
  dateformat: "yyyy-mm-dd hh:MM:ss",
  preprocess: preProcessingData,
  methods: ["log", "trace", "debug", "info", "warn", "error", "fatal"],
  filters: [
    {
      trace: [colors.magenta],
      debug: [colors.blue],
      info: [colors.green],
      warn: [colors.yellow],
      error: [colors.red],
      fatal: [colors.red, colors.bold],
    },
  ],
  transport: [printLogOnConsole, saveLogInLocal, saveLogInDatabase],
});
