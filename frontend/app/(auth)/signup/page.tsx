// "use client"
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react'


// export default function SignupPage(){
//     const router=   useRouter();


// const [form,setForm]=useState({name:"",email:"",password:""});
//     const [error,setError]=useState<string|null>(null);
//     const [loading,setLoading]=useState(false);


//     return(
//         <>
//         <p className='font-mono text-xs text-muted uppercase tracking-widest mb-2'>Step 1 of 1</p>
//         <h2 className='font-display text-2xl font-semibold mb-1'>Create  your account</h2>
//         <p>Start scanning your resume in under a minute </p>

//         {error &&(
//             <div className='mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm '>
//                 {error}
//             </div>
//         )}
//         <form className='space-y-4'>
//             <div>
//                 <label className='font-mono text-xs text-muted uppercase tracking-wide' >Name</label>
//                 <input
//                 className='mt-1.5 w-full bg-white  border border-white/10 rounded-md py-2.5 px-3 text-sm  text-black focus:outline-none focus:ring-2 focus:ring-signal/50 transition' placeholder='Khushi Sharma'
//                 type='text' required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
//             </div>

//             <div>
//                 <label className='font-mono text-xs text-muted uppercase tracking-wide' >Email</label>
//                 <input
//                 className='mt-1.5 w-full bg-white border border-white/10 rounded-md py-2.5 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-signal/50 transition' 
//                 type='email' required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}
//                 placeholder='you@example.com'/>
//             </div>
//             <div>
//                 <label className='font-mono text-xs text-muted uppercase tracking-wide' >Password</label>
//                 <input
//                 className='mt-1.5 w-full bg-white border border-white/10 rounded-md py-2.5 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-signal/50 transition' 
//                 type='password' minLength={6} required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}
//                 placeholder='At least 6 characters'/>
//             </div>
//             <button
//   type="submit"
//   disabled={loading}
//   className="w-full bg-signal text-ink font-medium text-sm rounded-md py-2.5 mt-2 hover:bg-signal/90 diabled:opacity-50 transition"
// >
//  {loading ? "Creating account...": "Create Account"
// }
// </button>
//         </form>
//         </>
//     )
    
// }
"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">

      <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">
        Step 1 of 1
      </p>

      <h2 className="text-2xl font-semibold mb-1">
        Create your account
      </h2>

      <p className="text-gray-600 mb-6">
        Start scanning your resume in under a minute
      </p>

      {error && (
        <div className="mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4">

        {/* NAME */}
        <div>
          <label className="font-mono text-xs text-gray-500 uppercase tracking-wide">
            Name
          </label>

          <input
            className="mt-1.5 w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Khushi Sharma"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="font-mono text-xs text-gray-500 uppercase tracking-wide">
            Email
          </label>

          <input
            className="mt-1.5 w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="font-mono text-xs text-gray-500 uppercase tracking-wide">
            Password
          </label>

          <input
            className="mt-1.5 w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            type="password"
            minLength={6}
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="At least 6 characters"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-300 text-black font-medium text-sm rounded-md py-2.5 mt-2 hover:bg-pink-400 disabled:opacity-50 transition"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

      </form>
      <p className="text-sm text-gray-500 mt-6 text-center">
  Already have an account?{" "}
  <Link
    className="text-pink-500 hover:text-pink-600 transition"
    href="/login"
  >
    Log in
  </Link>
</p>
    </div>
  );
}