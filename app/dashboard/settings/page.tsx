"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { updateName, deleteAccount } from "@/actions/settings.actions";

// ─────────────────────────────────────────────────────────────
// Shared UI Components (Tailwind v4)
// ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-1 text-base font-bold text-rv-ink">{children}</h2>;
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-xs leading-[1.55] text-rv-muted">{children}</p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rv-muted">
      {children}
    </label>
  );
}

function Feedback({ msg, isError }: { msg: string; isError: boolean }) {
  if (!msg) return null;

  return (
    <div
      className={`mt-2.5 rounded-sm border px-3 py-2 text-xs ${
        isError
          ? "border-[rgba(200,75,47,0.2)] bg-[rgba(200,75,47,0.07)] text-rv-accent"
          : "border-[rgba(45,122,79,0.2)] bg-[rgba(45,122,79,0.07)] text-[#2d7a4f]"
      }`}
    >
      {msg}
    </div>
  );
}

function SaveBtn({
  loading,
  label = "Save Changes",
}: {
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-3 cursor-pointer rounded-sm border-none bg-rv-ink px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rv-muted"
    >
      {loading ? "Saving…" : label}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-sm border border-rv-border bg-rv-white px-3 py-[0.55rem] text-sm text-rv-ink outline-none ${props.className ?? ""}`}
    />
  );
}

function TextInput(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-sm border border-rv-border bg-rv-white px-3 py-[0.55rem] text-sm text-rv-ink outline-none ${props.className ?? ""}`}
    />
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-5 rounded-md border border-rv-border bg-rv-white px-8 py-7 ${className}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Name Section
// ─────────────────────────────────────────────────────────────

function NameSection({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await updateName(name);

    setIsError(!!res?.error);
    setMsg(res?.error ?? "Name updated successfully.");
    setLoading(false);
  }

  return (
    <Card>
      <SectionTitle>Display Name</SectionTitle>
      <SectionDesc>
        This is the name shown in your dashboard and on your resumes by default.
      </SectionDesc>

      <form onSubmit={handleSubmit}>
        <Label>Full Name</Label>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="max-w-90 mr-3"
        />

        <SaveBtn loading={loading} />
        <Feedback msg={msg} isError={isError} />
      </form>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Password Section
// ─────────────────────────────────────────────────────────────

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (next !== confirm) {
      setIsError(true);
      setMsg("New passwords don't match.");
      return;
    }

    if (next.length < 8) {
      setIsError(true);
      setMsg("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });

    setIsError(!!error);
    setMsg(error?.message ?? "Password changed successfully.");

    if (!error) {
      setCurrent("");
      setNext("");
      setConfirm("");
    }

    setLoading(false);
  }

  return (
    <Card>
      <SectionTitle>Change Password</SectionTitle>
      <SectionDesc>
        Choose a strong password of at least 8 characters.
      </SectionDesc>

      <form onSubmit={handleSubmit} className="flex max-w-90 flex-col gap-3">
        <div>
          <Label>Current Password</Label>
          <Input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>

        <div>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>

        <SaveBtn loading={loading} label="Change Password" />
        <Feedback msg={msg} isError={isError} />
      </form>

      <p className="mt-3 text-xs text-rv-muted">
        Forgot your password?{" "}
        <Link href="/forgot-password" className="text-rv-accent underline">
          Reset via email
        </Link>
      </p>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Billing Section
// ─────────────────────────────────────────────────────────────

function BillingSection() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? "free"))
      .catch(() => setPlan("free"));
  }, []);

  const isPro = plan === "pro";

  async function handleUpgrade() {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setIsError(true);
    setMsg(data.error ?? "Something went wrong.");
    setLoading(false);
  }

  async function handlePortal() {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setIsError(true);
    setMsg(data.error ?? "Something went wrong.");
    setLoading(false);
  }

  return (
    <Card>
      <SectionTitle>Plan & Billing</SectionTitle>

      <SectionDesc>
        {isPro
          ? "You're on the Pro plan. Manage your subscription or update payment details below."
          : "You're on the Free plan — 10 AI uses per month, 3 templates, PDF export only."}
      </SectionDesc>

      <div className="mb-4 flex items-center justify-between rounded-sm border border-rv-border bg-rv-cream px-4 py-3">
        <div>
          <p className="mb-0.5 text-sm font-bold text-rv-ink">
            {isPro ? "✦ Pro Plan" : "Free Plan"}
          </p>

          <p className="text-xs text-rv-muted">
            {isPro
              ? "Unlimited AI · All templates · PDF + DOCX · No watermark"
              : "10 AI uses/month · 3 templates · PDF only"}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-widest ${
            isPro
              ? "bg-[rgba(45,90,61,0.1)] text-[#2d5a3d]"
              : "bg-[rgba(138,132,120,0.1)] text-rv-muted"
          }`}
        >
          {isPro ? "Active" : "Free"}
        </span>
      </div>

      {isPro ? (
        <button
          onClick={handlePortal}
          disabled={loading}
          className="cursor-pointer rounded-sm border-none bg-rv-ink px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rv-muted"
        >
          {loading ? "Loading…" : "Manage Subscription"}
        </button>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="cursor-pointer rounded-sm border-none bg-rv-accent px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rv-muted"
        >
          {loading ? "Loading…" : "Upgrade to Pro →"}
        </button>
      )}

      {msg && <Feedback msg={msg} isError={isError} />}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Danger Zone
// ─────────────────────────────────────────────────────────────

function DangerZone() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm !== "DELETE") return;

    setLoading(true);
    setMsg("");

    const res = await deleteAccount();

    if (res?.error) {
      setMsg(res.error);
      setLoading(false);
      return;
    }

    await authClient.signOut();
    router.push("/");
  }

  return (
    <Card className="border-[rgba(200,75,47,0.3)] bg-[rgba(200,75,47,0.02)]">
      <SectionTitle>Danger Zone</SectionTitle>
      <SectionDesc>
        Permanently delete your account and all associated resumes. This action
        cannot be undone.
      </SectionDesc>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="cursor-pointer rounded-sm border border-rv-accent bg-transparent px-5 py-2 text-sm font-semibold text-rv-accent"
        >
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="max-w-90">
          <p className="mb-3 text-xs leading-[1.55] text-rv-ink">
            This will permanently delete <strong>all your resumes</strong> and
            your account. Type <strong>DELETE</strong> to confirm.
          </p>

          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mb-2"
          />

          <div className="mt-1 flex gap-2">
            <button
              type="submit"
              disabled={confirm !== "DELETE" || loading}
              className={`cursor-pointer rounded-sm border-none px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rv-muted ${
                confirm === "DELETE" && !loading
                  ? "bg-rv-accent"
                  : "bg-rv-muted"
              }`}
            >
              {loading ? "Deleting…" : "Permanently Delete"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setConfirm("");
              }}
              className="cursor-pointer rounded-sm border border-rv-border bg-transparent px-5 py-2 text-sm text-rv-muted"
            >
              Cancel
            </button>
          </div>

          {msg && <Feedback msg={msg} isError />}
        </form>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-170 px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-xs text-rv-muted"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="font-serif text-4xl text-rv-accent">Account Settings</h1>

        <p className="mt-1 text-sm text-rv-muted">{session?.user?.email}</p>
      </div>

      <NameSection currentName={session?.user?.name ?? ""} />
      <PasswordSection />
      <BillingSection />
      <DangerZone />
    </div>
  );
}
