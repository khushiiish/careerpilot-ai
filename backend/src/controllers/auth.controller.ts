import { env } from "../config/env";

const REFRESH_COOKIE_OPTIONS= {
    httpOnly:true,
    secure:env.NODE_ENV === "production",
    sameSite:"lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export  async function signup(req:Request,res:Response):Promise<void> {
    try{

    }catch(err){
        
    }
}