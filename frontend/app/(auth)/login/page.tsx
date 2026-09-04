"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return(
    <>
    <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">Welcome back</p>
    <h2 className='font-display text-2xl font-semibold mb-1'>Log in</h2>
    <p className="text-muted text-sm mb-8">Pick up right where you left off</p>

    {error && (
      <div className="mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}

      </div>
    )}

    <form className="space-y-4">
       

      

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
          {loading ? "Logging in..." : "Log in"}
        </button>

      </form>
    </>
  )

}