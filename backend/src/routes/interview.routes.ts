import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { getInterviewQuestions } from "@/controllers/interview.controller";

const router=Router();
router.post("/questions", authenticate,getInterviewQuestions);

export default router;