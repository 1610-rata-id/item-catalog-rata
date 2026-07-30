import fs from "fs";
import path from "path";

import { ETL_CONFIG } from "./config";
import { ETLReport } from "./types/report";

export function writeReport(report: ETLReport) {
  if (!fs.existsSync(ETL_CONFIG.reportDirectory)) {
    fs.mkdirSync(ETL_CONFIG.reportDirectory, {
      recursive: true,
    });
  }

  const filename = `etl-report-${new Date()
    .toISOString()
    .replace(/:/g, "-")}.json`;

  const filepath = path.join(
    ETL_CONFIG.reportDirectory,
    filename
  );

  fs.writeFileSync(
    filepath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  return filepath;
}