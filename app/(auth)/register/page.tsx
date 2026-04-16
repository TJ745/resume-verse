"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // If user came from pricing Pro CTA — redirect to checkout
    if (planParam === "pro") {
      try {
        const res = await fetch("/api/lemonsqueezy/checkout", {
          method: "POST",
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } catch {
        // fall through to dashboard if checkout fails
      }
    }

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-105">
      {/* Heading */}
      <div className="mb-8">
        <p className="uppercase font-semibold tracking-widest mb-3 text-xs text-rv-accent">
          Get started
        </p>
        <h1 className="font-serif text-4xl tracking-tight">
          {planParam === "pro" ? "Start your Pro trial" : "Create your account"}
        </h1>
        {planParam === "pro" && (
          <p className="text-sm text-rv-muted mt-2">
            Create a free account — you&apos;ll be taken to checkout to start
            your 7-day Pro trial.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-rv-ink">
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
            className="w-full px-4 py-3 rounded border border-rv-border bg-rv-white text-rv-ink text-base focus:ring-2 focus:ring-rv-accent focus:outline-none"
          />
        </div>

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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-rv-ink">
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
          disabled={loading}
          className={`mt-1 font-semibold transition-all duration-150 text-rv-white p-3.5 rounded text-base ${loading ? "cursor-not-allowed bg-rv-muted" : "bg-rv-accent cursor-pointer"}`}
        >
          {loading
            ? planParam === "pro"
              ? "Creating account…"
              : "Creating account…"
            : planParam === "pro"
              ? "Create account & start trial →"
              : "Create account →"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-rv-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium no-underline text-rv-ink border-b border-rv-border"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
