"use client";

import Link from "next/link";
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

  return (
    <>
      <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-widest mb-2">
        Welcome back
      </p>
      <h2 className="font-display text-2xl font-semibold mb-1 text-white">
        Log in
      </h2>
      <p className="text-[#8B949E] text-sm mb-8">
        Pick up right where you left off
      </p>

      {error && (
        <div className="mb-5 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="font-mono text-xs text-[#8B949E] uppercase tracking-wide">
            Email
          </label>
          <input
            className="mt-1.5 w-full bg-[#161B22] border border-white/10 rounded-md py-2.5 px-3 text-sm text-[#F8F9FA] placeholder:text-[#8B949E]/50 focus:outline-none focus:ring-2 focus:ring-[#E8BCC9]/40 focus:border-[#E8BCC9] transition"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs text-[#8B949E] uppercase tracking-wide">
              Password
            </label>
          </div>
          <input
            className="mt-1.5 w-full bg-[#161B22] border border-white/10 rounded-md py-2.5 px-3 text-sm text-[#F8F9FA] placeholder:text-[#8B949E]/50 focus:outline-none focus:ring-2 focus:ring-[#E8BCC9]/40 focus:border-[#E8BCC9] transition"
            type="password"
            minLength={6}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
          />
        </div>

        {/* SUBMIT BUTTON - Pink accent with dark ink text */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E8BCC9] text-[#0E1116] font-semibold text-sm rounded-md py-2.5 mt-2 hover:bg-[#f2cbd6] disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8B949E]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#E8BCC9] hover:underline transition"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
