import tracer from "tracer";
import colors from "colors";

import { logger } from "@/config/env";
import { setLogInLocal } from "@/logger/local";
import { setLogInDatabase } from "@/logger/database";

const printLogOnConsole = (data: tracer.Tracer.LogOutput) => {
  console.log(data.output);
};

const preProcessingData = (data: tracer.Tracer.LogOutput): void => {
  data.title = data.title.toUpperCase();
};

export const Logger = tracer.colorConsole({
  level: logger.LOG_LEVEL,
  format:
    "[{{timestamp}}] {{title}}\n{{file}} | {{method}} | {{line}}\n{{message}}",
  dateformat: "yyyy-mm-dd hh:MM:ss.l", // Z for GMT like time zone
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
  transport: [printLogOnConsole, setLogInLocal, setLogInDatabase],
});
