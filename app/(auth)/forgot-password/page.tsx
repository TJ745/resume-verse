"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="w-full text-center" style={{ maxWidth: 420 }}>
        <div
          className="flex items-center justify-center mx-auto mb-6"
          style={{
            width: 56,
            height: 56,
            background: "rgba(200,75,47,0.1)",
            borderRadius: "50%",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>✉️</span>
        </div>
        <h1
          className="font-serif mb-3"
          style={{ fontSize: "2rem", letterSpacing: "-0.025em" }}
        >
          Check your inbox
        </h1>
        <p
          className="mb-8"
          style={{
            color: "var(--rv-muted)",
            lineHeight: 1.65,
            fontSize: "0.9375rem",
          }}
        >
          We sent a reset link to{" "}
          <strong style={{ color: "var(--rv-ink)" }}>{email}</strong>. It
          expires in 1 hour.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium no-underline"
          style={{
            color: "var(--rv-muted)",
            borderBottom: "1px solid var(--rv-border)",
          }}
        >
          ← Back to sign in
        </Link>
      </div>
    );
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
          Password reset
        </p>
        <h1
          className="font-serif mb-2"
          style={{
            fontSize: "2.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          Forgot your password?
        </h1>
        <p
          style={{
            color: "var(--rv-muted)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
          }}
        >
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {status === "error" && (
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

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 font-semibold"
          style={{
            background:
              status === "loading" ? "var(--rv-muted)" : "var(--rv-accent)",
            color: "var(--rv-white)",
            padding: "0.85rem",
            borderRadius: 2,
            border: "none",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            fontSize: "0.9375rem",
          }}
        >
          {status === "loading" ? "Sending…" : "Send reset link →"}
        </button>
      </form>

      <p
        className="text-center mt-6 text-sm"
        style={{ color: "var(--rv-muted)" }}
      >
        <Link
          href="/login"
          className="font-medium no-underline"
          style={{
            color: "var(--rv-ink)",
            borderBottom: "1px solid var(--rv-border)",
          }}
        >
          ← Back to sign in
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
