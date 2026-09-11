import { SignupInput, LoginInput } from "../types/auth.types";
import logger from "../utils/logger";
import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

export class AuthError extends Error {
    statusCode:number;
    constructor(message:string,statusCode=400){
        super(message),
        this.statusCode=statusCode
    }

}

export async function signupUser(input:SignupInput){
    const existingUser=await prisma.user.findUnique({
        where: { email: input.email },


    });
    if(existingUser){
        throw new AuthError("an account with thi email already exists",409);
    };
    const hashedPassword=await hashPassword(input.password);

    const user= await prisma.user.create({
        data:{
            name:input.name,
            email:input.email,
            password:hashedPassword
        }
    })

    logger.info("New user signed up",{userId:user.id, email:user.email});

    const accessToken=generateAccessToken({
        userId:user.id,
        email:user.email
    })

    const refreshToken=generateRefreshToken({
        userId:user.id,
        email:user.email
    })


    return{
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            isPremium:user.isPremium,
        },
        accessToken,
        refreshToken
    }
}

export async function loginUser(input:LoginInput){
    const user=await prisma.user.findUnique({where:{email:input.email}});

    if(!user){
        throw new AuthError("Invalid email or password",401);

    };

    const isPasswordValid=await comparePassword(input.password,user.password);

    if(!isPasswordValid){
        throw new AuthError("Invalid email or password",401)
    };

    logger.info("User logged in",{ userId:user.id, email:user.email });


     const accessToken=generateAccessToken({
        userId:user.id,
        email:user.email
    })

    const refreshToken=generateRefreshToken({
        userId:user.id,
        email:user.email
    });
     return{
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            isPremium:user.isPremium,
        },
        accessToken,
        refreshToken
    }
}


export async function logoutUser(accessToken:string,userId:string){
    const decoded=jwt.decode(accessToken) as {exp?:number} | null;

    const expiresAt=decoded?.exp
    ? new  Date(decoded.exp *1000)
    :new Date(Date.now()+ 15 * 60 *1000);

    await prisma.blacklistToken.create({
        data:{
            token:accessToken,
            userId,
            expiresAt
        }
    });
    logger.info("USER LOGGED OUT,token blacklisted",{userId})
}


