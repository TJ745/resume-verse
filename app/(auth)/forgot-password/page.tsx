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

    const { error } = await authClient.requestPasswordReset({
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
      <div className="w-full text-center max-w-105">
        <div className="flex items-center justify-center mx-auto mb-6 w-14 h-14 bg-[rgba(200,75,47,0.1)] rounded-2xl">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="font-serif mb-3 tracking-tight text-4xl">
          Check your inbox
        </h1>
        <p className="mb-8 text-rv-muted text-base">
          We sent a reset link to{" "}
          <strong className="text-rv-ink">{email}</strong>. It expires in 1
          hour.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium no-underline text-rv-muted border-b border-rv-border"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-105">
      {/* Heading */}
      <div className="mb-8">
        <p className="uppercase font-semibold tracking-widest mb-3 text-rv-accent text-xs">
          Password reset
        </p>
        <h1 className="font-serif mb-2 tracking-tight text-4xl">
          Forgot your password?
        </h1>
        <p className="text-rv-muted text-base">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {status === "error" && (
          <p className="text-sm px-4 py-3 bg-[rgba(200,75,47,0.08)] border border-[rgba(200,75,47,0.2)] rounded text-rv-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className={`mt-1 font-semibold transition-all duration-150 text-rv-white p-3.5 rounded text-base ${status === "loading" ? "cursor-not-allowed bg-rv-muted" : "bg-rv-accent cursor-pointer"}`}
        >
          {status === "loading" ? "Sending…" : "Send reset link →"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-rv-muted">
        <Link
          href="/login"
          className="font-medium no-underline text-rv-ink border-b border-rv-border"
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
