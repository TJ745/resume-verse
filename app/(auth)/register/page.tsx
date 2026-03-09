"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
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
          Get started
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: "2.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          Create your account
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-sm font-medium"
            style={{ color: "var(--rv-ink)" }}
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alexandra Chen"
            style={inputStyle}
          />
        </div>

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
          <label
            htmlFor="password"
            className="text-sm font-medium"
            style={{ color: "var(--rv-ink)" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
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
          {loading ? "Creating account…" : "Create account →"}
        </button>
      </form>

      {/* Footer link */}
      <p
        className="text-center mt-6 text-sm"
        style={{ color: "var(--rv-muted)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium no-underline"
          style={{
            color: "var(--rv-ink)",
            borderBottom: "1px solid var(--rv-border)",
          }}
        >
          Sign in
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
