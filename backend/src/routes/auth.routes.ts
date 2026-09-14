import { Router } from "express";

import { loginSchema, signupSchema } from "../types/auth.types";
import { login, logout, signup } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router=Router();
router.post("/signup",validate(signupSchema),signup);
router.post("/login",validate(loginSchema),login);
router.post("/logout",authenticate,logout);

export default router;