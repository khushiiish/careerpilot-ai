import { Request, Response, NextFunction} from "express";
import { verifyAccessToken } from "../utils/jwt";
import prisma from "../lib/prisma";


export interface AuthRequest extends Request {
    userId?:string;
    userEmail?:string

};

export async function authenticate(
    req:AuthRequest,
    res:Response,
    next:NextFunction
):Promise<void>{
    try{
        const authHeader=req.headers.authorization;
        const token=authHeader?.split(" ")[1];

        if(!token){
            res.status(401).json({status:"error",message:"No Access token provided"});
            return
        }
        const blacklisted=await prisma.blacklistToken.findUnique({
            where:{token}
        });
        if(blacklisted){
            res.status(401).json({status:"error",message:"Token has been revoked"});
            return;
        }
        const decoded=verifyAccessToken(token);
        req.userId=decoded.userId;
        req.userEmail=decoded.email;

        next()


    }catch{
        res.status(401).json({status:"error",message:"Invalid or expired token"})
    }
}