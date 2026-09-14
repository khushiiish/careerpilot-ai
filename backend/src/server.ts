import "tsconfig-paths/register";

import app from "@/app";
import { env } from "@/config/env";
import logger from "@/utils/logger";

const server = app.listen(env.PORT, () => {
  logger.info(
    `Server running on port ${env.PORT} in ${env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    error: err.message,
    stack: err.stack,
  });

  server.close(() => {
    process.exit(1);
  });
});