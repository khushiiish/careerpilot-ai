import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? JSON.stringify(meta)
      : "";

    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
  })
);

const fileFormat = combine(
  timestamp(),
  json()
);

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },

  level: env.LOG_LEVEL,

  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: fileFormat,
    }),
  ],
});

winston.addColors({
  http: "magenta",
});

export default logger;