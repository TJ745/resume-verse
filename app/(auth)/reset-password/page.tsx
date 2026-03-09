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
      <div className="w-full text-center" style={{ maxWidth: 420 }}>
        <h1 className="font-serif mb-3" style={{ fontSize: "2rem" }}>
          Invalid link
        </h1>
        <p style={{ color: "var(--rv-muted)", marginBottom: "2rem" }}>
          This reset link is missing or invalid.
        </p>
        <Link
          href="/forgot-password"
          className="font-medium no-underline"
          style={{
            color: "var(--rv-accent)",
            borderBottom: "1px solid var(--rv-accent)",
          }}
        >
          Request a new one →
        </Link>
      </div>
    );
  }

  if (status === "success") {
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
          <span style={{ fontSize: "1.5rem" }}>✓</span>
        </div>
        <h1 className="font-serif mb-3" style={{ fontSize: "2rem" }}>
          Password updated!
        </h1>
        <p style={{ color: "var(--rv-muted)", fontSize: "0.9375rem" }}>
          Redirecting you to sign in…
        </p>
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
          New password
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: "2.25rem",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          Reset your password
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium"
            style={{ color: "var(--rv-ink)" }}
          >
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
            style={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm"
            className="text-sm font-medium"
            style={{ color: "var(--rv-ink)" }}
          >
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
            style={inputStyle}
          />
        </div>

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
          {status === "loading" ? "Updating…" : "Update password →"}
        </button>
      </form>
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
