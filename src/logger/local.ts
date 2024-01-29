import fse from "fs-extra";
import tracer from "tracer";
import csv from "csv-parser";

import { logger } from "@/config/env";
import { Logger } from "@/logger/logger";
import { Log } from "@/components/logs/columns";

const addHeading = (data: tracer.Tracer.LogOutput) => {
  const headings: string = `timestamp,title,file,method,line,message\n${data.timestamp},${data.title},${data.file},${data.method},${data.line},"${data.message}"\n`;

  fse.writeFile(logger.LOG_FILE_NAME, headings, (err: any) => {
    if (err) {
      Logger.fatal("💥 ~ fse.writeFile ~ Error creating log file:", err);
    } else {
      Logger.info(
        "🚀 ~ fse.writeFile ~ File created successfully:",
        logger.LOG_FILE_NAME
      );
    }
  });
};

export function setLogInLocal(data: tracer.Tracer.LogOutput) {
  if (logger.LOCAL_LOG !== "true") return;

  if (!fse.existsSync(logger.LOG_FILE_NAME)) {
    addHeading(data);
  }

  fse.stat(logger.LOG_FILE_NAME, (err, stats) => {
    if (err) {
      console.log("💥 ~ fse.stat ~ err:", err);
    } else {
      if (stats.size == 0) {
        addHeading(data);
      } else {
        fse
          .createWriteStream(logger.LOG_FILE_NAME, {
            flags: "a",
            encoding: "utf8",
            mode: 0o666,
          })
          .on("error", (error) => {
            Logger.fatal("💥 ~ createWriteStream ~ .on ~ error:", error);
          })
          .write(
            `${data.timestamp},${data.title},${data.file},${data.method},${data.line},"${data.message}"\n`
          );
      }
    }
  });
}

export function getLogFromLocal(): Promise<Log[]> | undefined {
  if (logger.LOCAL_LOG !== "true") return undefined;

  const result: any[] = [];

  return new Promise((resolve, reject) => {
    fse
      .createReadStream(logger.LOG_FILE_NAME, {
        flags: "a+",
        encoding: "utf8",
        mode: 0o666,
      })
      .pipe(csv())
      .on("data", (data: any) => {
        result.push(data);
      })
      .on("end", () => {
        resolve(result);
      })
      .on("error", (err) => {
        Logger.fatal("💥 ~ createReadStream ~ .on ~ err:", err);
        reject;
      });
  });
}
