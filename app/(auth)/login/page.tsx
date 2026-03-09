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
    <div className="w-full" style={{ maxWidth: 420 }}>
      {/* Heading */}
      <div className="mb-8">
        <p
          className="uppercase font-semibold tracking-widest mb-3"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            color: "var(--rv-accent)",
          }}
        >
          Welcome back
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: "2.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          Sign in to ResumeVerse
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium"
            style={{ color: "var(--rv-ink)" }}
          >
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
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "var(--rv-ink)" }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm no-underline"
              style={{
                color: "var(--rv-muted)",
                borderBottom: "1px solid var(--rv-border)",
              }}
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
            style={inputStyle}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-sm px-4 py-3"
            style={{
              background: "rgba(200,75,47,0.08)",
              border: "1px solid rgba(200,75,47,0.2)",
              borderRadius: 2,
              color: "var(--rv-accent)",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 font-semibold transition-all duration-150"
          style={{
            background: loading ? "var(--rv-muted)" : "var(--rv-accent)",
            color: "var(--rv-white)",
            padding: "0.85rem",
            borderRadius: 2,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.9375rem",
          }}
        >
          {loading ? "Signing in…" : "Sign in →"}
        </button>
      </form>

      {/* Footer link */}
      <p
        className="text-center mt-6 text-sm"
        style={{ color: "var(--rv-muted)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium no-underline"
          style={{
            color: "var(--rv-ink)",
            borderBottom: "1px solid var(--rv-border)",
          }}
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.9375rem",
  outline: "none",
  fontFamily: "inherit",
};
