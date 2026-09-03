"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


export default function SignupPage(){
    const router=   useRouter();


const [form,setForm]=useState({name:"",email:"",password:""});
    const [error,setError]=useState<string|null>(null);
    const [loading,setLoading]=useState(false);


    return(
        <>
        <p className='font-mono text-xs text-muted uppercase tracking-widest mb-2'>Step 1 of 1</p>
        <h2 className='font-display text-2xl font-semibold mb-1'>Create  your account</h2>
        <p>Start scanning your resume in under a minute </p>

        {error &&(
            <div className='mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm '>
                {error}
            </div>
        )}
        </>
    )
    
}