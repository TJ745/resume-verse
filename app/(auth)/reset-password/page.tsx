"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setError(error.message ?? "Reset failed. The link may have expired.");
      setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(() => router.push("/login"), 2500);
  }

  // No token in URL
  if (!token) {
    return (
      <div className="w-full text-center max-w-105">
        <h1 className="font-serif mb-3 text-4xl">Invalid link</h1>
        <p className="text-rv-muted mb-8">
          This reset link is missing or invalid.
        </p>
        <Link
          href="/forgot-password"
          className="font-medium no-underline text-rv-accent border-b border-rv-accent"
        >
          Request a new one →
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full text-center max-w-105">
        <div className="flex items-center justify-center mx-auto mb-6 w-14 h-14 bg-[rgba(200,75,47,0.1)] rounded-2xl">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="font-serif mb-3 text-4xl">Password updated!</h1>
        <p className="text-rv-muted text-base">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-105">
      {/* Heading */}
      <div className="mb-8">
        <p className="uppercase font-semibold tracking-widest mb-3 text-xs text-rv-accent">
          New password
        </p>
        <h1 className="font-serif text-4xl tracking-tight">
          Reset your password
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-rv-ink">
            New password
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
            className="w-full px-4 py-3 rounded border border-rv-border bg-rv-white text-rv-ink text-base focus:ring-2 focus:ring-rv-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-medium text-rv-ink">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="w-full px-4 py-3 rounded border border-rv-border bg-rv-white text-rv-ink text-base focus:ring-2 focus:ring-rv-accent focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-sm px-4 py-3 bg-[rgba(200,75,47,0.08)] border border-[rgba(200,75,47,0.2)] rounded text-rv-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className={`mt-1 font-semibold transition-all duration-150 text-rv-white p-3.5 rounded text-base ${status === "loading" ? "cursor-not-allowed bg-rv-muted" : "bg-rv-accent cursor-pointer"}`}
        >
          {status === "loading" ? "Updating…" : "Update password →"}
        </button>
      </form>
    </div>
  );
}
