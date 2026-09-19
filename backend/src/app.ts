import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import resumeRoutes from "./routes/resume.routes";

import logger from "./utils/logger";
import authRoutes from "./routes/auth.routes";
import prisma from "./lib/prisma";
import analyzeRoutes from "./routes/analyze.routes";
import interviewRoutes from "./routes/interview.routes"

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: "error",
    message: "Too many attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    status: "error",
    message: "Analysis limit reached, please try again in an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

app.use(morgan("combined", { stream: morganStream as any }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/resumes",resumeRoutes);
app.use("/api/analyze",analyzeLimiter,analyzeRoutes);
app.use("/api/interview",analyzeLimiter,interviewRoutes)

app.get("/api/db-check", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      status: "Connected",
      userCount,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: (err as Error).message,
    });
  }
});

export default app;