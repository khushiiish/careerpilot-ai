import { getMyResumes, uploadResume } from "@/controllers/resume.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express"
import { uploadResume as uploadMiddleware } from "@/middlewares/upload.middleware";

const router=Router();

router.post(
    "/upload",
    authenticate,
    uploadMiddleware.single("resume"),
    uploadResume,
);

router.get("/",authenticate,getMyResumes);

export default router;