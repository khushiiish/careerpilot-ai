import jwt from "jsonwebtoken"

import { env } from "@/config/env"

export interface TokenPayLoad{

    userId:string;
    email:string;

}

export function generateAccessToken(payload:TokenPayload):string{

    return jwt.sign(payload,)

}