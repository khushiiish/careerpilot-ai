import { Router } from "express";
import { analyzeJobFit } from "@/controllers/analyze.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router=Router();
router.post("/job-fit", authenticate,analyzeJobFit);

export default router;