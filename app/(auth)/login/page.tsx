"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="w-full max-w-105">
      {/* Heading */}
      <div className="mb-8">
        <p className="uppercase font-semibold tracking-widest mb-3 text-xs text-rv-accent">
          Welcome back
        </p>
        <h1 className="font-serif text-4xl tracking-tight">
          Sign in to ResumeVerse
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-rv-ink">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded border border-rv-border bg-rv-white text-rv-ink text-base focus:ring-2 focus:ring-rv-accent focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-rv-ink"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm no-underline text-rv-muted border-b border-rv-border"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full px-4 py-3 rounded border border-rv-border bg-rv-white text-rv-ink text-base focus:ring-2 focus:ring-rv-accent focus:outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm px-4 py-3 bg-[rgba(200,75,47,0.08)] border border-[rgba(200,75,47,0.2)] rounded text-rv-accent">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-1 font-semibold transition-all duration-150 text-rv-white p-3.5 rounded text-base ${loading ? "cursor-not-allowed bg-rv-muted" : "bg-rv-accent cursor-pointer"}`}
        >
          {loading ? "Signing in…" : "Sign in →"}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center mt-6 text-sm text-rv-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium no-underline text-rv-ink border-b border-rv-border"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
