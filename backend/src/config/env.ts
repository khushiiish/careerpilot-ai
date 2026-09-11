import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: parseInt(getEnv("PORT", "5000"), 10),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),

  DATABASE_URL: getEnv("DATABASE_URL"),

  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),

  JWT_ACCESS_EXPIRY: getEnv("JWT_ACCESS_EXPIRY", "15m"),
  JWT_REFRESH_EXPIRY: getEnv("JWT_REFRESH_EXPIRY", "7d"),

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),
};