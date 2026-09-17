import { AuthRequest } from "@/middlewares/auth.middleware";
import logger from "@/utils/logger";
import { Response } from "express";
import path from "path"
import prisma from "@/lib/prisma";
import { extractTextFromPdf } from "@/utils/pdfExtractor";
import { parseResumeWithGemini } from "@/services/resumeParser.service";




export async function uploadResume(req:AuthRequest,res:Response):Promise<void>{
    try{
        const userId=req.userId;
        const file=req.file;

        if(!file){
            res.status(400).json({status:"error",message:"No file uploaded"})
            return
        };
        if(!userId){
            res.status(401).json({status:"error",message:"Unauthorized"});
            return
        }
        const filePath=path.join(process.cwd(),"uploads/resumes",file.filename)
        logger.info("Resume upload,extracting text",{
            userId,
            filename:file.filename
        });

        const rawText=await extractTextFromPdf(filePath);
        if(!rawText || rawText.length <50){
            res.status(400).json({
                status:"error",
                message:"Could not extract readable text from this PDF"
            })
        }

        logger.info("Sending resume text to Gemini for parsing",{ userId });
        const parsedData=await parseResumeWithGemini(rawText);

        const resume=await prisma.resume.create({
            data:{
                userId,
                originalName:file.originalname,
                fileUrl:`/uploads/resumes/${file.fieldname}`,
                parsedText:rawText,
                parsedSkills:parsedData as any
            }
        })

        logger.info("Resume parsed and saved", {userId, resumeId:resume.id });

        res.status(201).json({
            status:"success",
            resume: {
                id:resume.id,
                originalName: resume.originalName,
                parsedData,
            }
        })



    }catch(err){
        logger.error("Resume upload failed",{error:(err as Error).message});
        res
        .status(500)
        .json({status:"error",message:"Failed to process resume"})

    }
}

export async function getMyResumes(
    req:AuthRequest,
    res:Response,
):Promise<void>{
    try{

        const userId=req.userId;
        const resumes=await prisma.resume.findMany({
            where:{userId},
            orderBy:{createdAt:"desc"},
            select:{
                id:true,
                originalName:true,
                parsedSkills:true,
                atsScore:true,
                createdAt:true
            }
        });

        res.status(200).json({status:"success",resumes})

    }catch(err){
        logger.error("Failed to fetch resumes",{ error:(err as Error).message });

    res
    .status(500)
    .json({ status:"error", message: "Failed to fetch resumes "});
    }
}