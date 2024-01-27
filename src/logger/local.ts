import fs from "fs";
import tracer from "tracer";

import { logger } from "@/config/env";

export const saveLogInLocal = (data: tracer.Tracer.LogOutput) => {
  if (logger.LOCAL_LOG !== "true") return;

  fs.createWriteStream(logger.LOG_FILE_NAME, {
    flags: "a",
    encoding: "utf8",
    mode: 0o666,
  }).write(
    `${data.timestamp},${data.title},${data.file},${data.method},${data.line},"${data.message}"\n`
  );
};
