"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import Link from "next/link";
import { updateName, deleteAccount } from "@/actions/settings.actions";

// ── Shared primitives ─────────────────────────────────────

const iCls =
  "w-full px-3 py-2.5 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.85rem] outline-none focus:border-rv-accent transition-colors";
const cardCls = "bg-rv-white border border-rv-border rounded-[4px] p-7 mb-5";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.95rem] font-bold text-rv-ink mb-1">{children}</h2>
  );
}
function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.78rem] text-rv-muted mb-5 leading-snug">{children}</p>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[0.72rem] font-semibold text-rv-muted mb-1.5 tracking-[0.04em] uppercase">
      {children}
    </label>
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
      className={`mt-3 px-5 py-2 border-0 rounded-sm text-white text-[0.8rem] font-semibold transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-ink cursor-pointer hover:bg-rv-accent"}`}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}
function Feedback({ msg, isError }: { msg: string; isError: boolean }) {
  if (!msg) return null;
  return (
    <div
      className={`mt-2.5 text-[0.78rem] px-3 py-2 rounded-sm border ${isError ? "bg-[rgba(200,75,47,0.07)] text-rv-accent border-[rgba(200,75,47,0.2)]" : "bg-[rgba(45,122,79,0.07)] text-[#2d7a4f] border-[rgba(45,122,79,0.2)]"}`}
    >
      {msg}
    </div>
  );
}

// ── Name section ──────────────────────────────────────────

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
    <div className={cardCls}>
      <SectionTitle>Display Name</SectionTitle>
      <SectionDesc>
        This is the name shown in your dashboard and on your resumes by default.
      </SectionDesc>
      <form onSubmit={handleSubmit}>
        <Label>Full Name</Label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${iCls} max-w-90 mr-3`}
          placeholder="Your name"
        />
        <SaveBtn loading={loading} />
        <Feedback msg={msg} isError={isError} />
      </form>
    </div>
  );
}

// ── Password section ──────────────────────────────────────

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
    <div className={cardCls}>
      <SectionTitle>Change Password</SectionTitle>
      <SectionDesc>
        Choose a strong password of at least 8 characters.
      </SectionDesc>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-90">
        <div>
          <Label>Current Password</Label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={iCls}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <div>
          <Label>New Password</Label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={iCls}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={iCls}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <SaveBtn loading={loading} label="Change Password" />
        <Feedback msg={msg} isError={isError} />
      </form>
      <p className="mt-3 text-[0.72rem] text-rv-muted">
        Forgot your password?{" "}
        <Link href="/forgot-password" className="text-rv-accent underline">
          Reset via email
        </Link>
      </p>
    </div>
  );
}

// ── Billing section ───────────────────────────────────────

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
    <div className={cardCls}>
      <SectionTitle>Plan & Billing</SectionTitle>
      <SectionDesc>
        {isPro
          ? "You're on the Pro plan. Manage your subscription or update payment details below."
          : "You're on the Free plan — 10 AI uses per month, 3 templates, PDF export only."}
      </SectionDesc>

      <div className="flex items-center justify-between px-4 py-3.5 bg-rv-cream rounded-sm border border-rv-border mb-4">
        <div>
          <p className="text-[0.8rem] font-bold text-rv-ink mb-0.5">
            {isPro ? "✦ Pro Plan" : "Free Plan"}
          </p>
          <p className="text-[0.72rem] text-rv-muted">
            {isPro
              ? "Unlimited AI · All templates · PDF + DOCX · No watermark"
              : "10 AI uses/month · 3 templates · PDF only"}
          </p>
        </div>
        <span
          className={`text-[0.6rem] font-extrabold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full ${isPro ? "bg-[rgba(45,90,61,0.1)] text-[#2d5a3d]" : "bg-[rgba(138,132,120,0.1)] text-rv-muted"}`}
        >
          {isPro ? "Active" : "Free"}
        </span>
      </div>

      {isPro ? (
        <button
          onClick={handlePortal}
          disabled={loading}
          className={`px-5 py-2 border-0 rounded-sm text-white text-[0.8rem] font-semibold transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-ink cursor-pointer hover:bg-rv-accent"}`}
        >
          {loading ? "Loading…" : "Manage Subscription"}
        </button>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className={`px-5 py-2 border-0 rounded-sm text-white text-[0.8rem] font-semibold transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
        >
          {loading ? "Loading…" : "Upgrade to Pro →"}
        </button>
      )}
      {msg && <Feedback msg={msg} isError={isError} />}
    </div>
  );
}

// ── Danger zone ───────────────────────────────────────────

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
    <div className="bg-[rgba(200,75,47,0.02)] border border-[rgba(200,75,47,0.3)] rounded-lg p-7 mb-5">
      <SectionTitle>Danger Zone</SectionTitle>
      <SectionDesc>
        Permanently delete your account and all associated resumes. This action
        cannot be undone.
      </SectionDesc>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-transparent text-rv-accent border border-rv-accent rounded-sm text-[0.8rem] font-semibold cursor-pointer hover:bg-rv-accent hover:text-white transition-colors"
        >
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="max-w-90">
          <p className="text-[0.78rem] text-rv-ink mb-3 leading-snug">
            This will permanently delete <strong>all your resumes</strong> and
            your account. Type <strong>DELETE</strong> to confirm.
          </p>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className={`${iCls} mb-2`}
          />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={confirm !== "DELETE" || loading}
              className={`px-5 py-2 border-0 rounded-sm text-white text-[0.8rem] font-semibold transition-colors ${confirm === "DELETE" && !loading ? "bg-rv-accent cursor-pointer hover:bg-rv-ink" : "bg-rv-muted cursor-not-allowed"}`}
            >
              {loading ? "Deleting…" : "Permanently Delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setConfirm("");
              }}
              className="px-5 py-2 bg-transparent text-rv-muted border border-rv-border rounded-sm text-[0.8rem] cursor-pointer hover:border-rv-ink hover:text-rv-ink transition-colors"
            >
              Cancel
            </button>
          </div>
          {msg && <Feedback msg={msg} isError />}
        </form>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-170 mx-auto px-6 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-[0.75rem] text-rv-muted no-underline inline-flex items-center gap-1 mb-4 hover:text-rv-ink transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-[1.75rem] text-rv-ink mb-1">
          Account Settings
        </h1>
        <p className="text-[0.82rem] text-rv-muted">{session?.user?.email}</p>
      </div>

      <NameSection currentName={session?.user?.name ?? ""} />
      <PasswordSection />
      <BillingSection />
      <DangerZone />
    </div>
  );
}
