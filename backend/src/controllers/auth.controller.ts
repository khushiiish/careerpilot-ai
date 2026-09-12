import { env } from "../config/env";
import {
  AuthError,
  loginUser,
  signupUser,
} from "../services/auth.service";
import { SignupInput, LoginInput } from "../types/auth.types";
import logger from "../utils/logger";
import { Request, Response } from "express";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function signup(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const input = req.body as SignupInput;

    const { user, accessToken, refreshToken } = await signupUser(input);

    res.cookie(
      "refreshToken",
      refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    res.status(201).json({
      status: "success",
      user,
      accessToken,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
      return;
    }

    logger.error("Signup failed", {
      error: (err as Error).message,
    });

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

export async function login(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const input = req.body as LoginInput;

    const { user, accessToken, refreshToken } = await loginUser(input);

    res.cookie(
      "refreshToken",
      refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    res.status(200).json({
      status: "success",
      user,
      accessToken,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
      return;
    }

    logger.error("Login failed", {
      error: (err as Error).message,
    });

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}