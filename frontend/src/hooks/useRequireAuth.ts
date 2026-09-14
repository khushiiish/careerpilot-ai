"use client";

import { useEffect } from "react";
import { useAuthStore} from "../store/authStore";
import { useRouter } from "next/router";

export function useRequireAuth(){
    const router=useRouter();
    const isAuthenticated=useAuthStore((s)=> s.isAuthenticated);
    const user=useAuthStore((s)=> s.user);
    useEffect(()=>{
        if(!isAuthenticated){
            router.push("/login")

        }

    },[isAuthenticated,router])

    return { user, isAuthenticated };
}