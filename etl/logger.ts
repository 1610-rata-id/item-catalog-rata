type LogLevel = "INFO" | "WARN" | "ERROR";

function write(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();

  const log = {
    timestamp,
    level,
    message,
    meta,
  };

  console.log(JSON.stringify(log));
}

export const logger = {
  info(message: string, meta?: unknown) {
    write("INFO", message, meta);
  },

  warn(message: string, meta?: unknown) {
    write("WARN", message, meta);
  },

  error(message: string, meta?: unknown) {
    write("ERROR", message, meta);
  },
};