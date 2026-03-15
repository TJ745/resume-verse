// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession, authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { updateName, deleteAccount } from "@/actions/settings.actions";

// // ── Shared styles ─────────────────────────────────────────

// const inp: React.CSSProperties = {
//   width: "100%",
//   padding: "0.55rem 0.75rem",
//   border: "1px solid var(--rv-border)",
//   borderRadius: 2,
//   background: "var(--rv-white)",
//   color: "var(--rv-ink)",
//   fontSize: "0.85rem",
//   fontFamily: "inherit",
//   outline: "none",
//   boxSizing: "border-box",
// };

// const card: React.CSSProperties = {
//   background: "var(--rv-white)",
//   border: "1px solid var(--rv-border)",
//   borderRadius: 4,
//   padding: "1.75rem 2rem",
//   marginBottom: "1.25rem",
// };

// function SectionTitle({ children }: { children: React.ReactNode }) {
//   return (
//     <h2
//       style={{
//         fontSize: "0.95rem",
//         fontWeight: 700,
//         color: "var(--rv-ink)",
//         marginBottom: "0.25rem",
//       }}
//     >
//       {children}
//     </h2>
//   );
// }
// function SectionDesc({ children }: { children: React.ReactNode }) {
//   return (
//     <p
//       style={{
//         fontSize: "0.78rem",
//         color: "var(--rv-muted)",
//         marginBottom: "1.25rem",
//         lineHeight: 1.55,
//       }}
//     >
//       {children}
//     </p>
//   );
// }
// function Label({ children }: { children: React.ReactNode }) {
//   return (
//     <label
//       style={{
//         display: "block",
//         fontSize: "0.72rem",
//         fontWeight: 600,
//         color: "var(--rv-muted)",
//         marginBottom: 5,
//         letterSpacing: "0.04em",
//         textTransform: "uppercase",
//       }}
//     >
//       {children}
//     </label>
//   );
// }
// function SaveBtn({
//   loading,
//   label = "Save Changes",
// }: {
//   loading: boolean;
//   label?: string;
// }) {
//   return (
//     <button
//       type="submit"
//       disabled={loading}
//       style={{
//         padding: "0.5rem 1.25rem",
//         background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
//         color: "#fff",
//         border: "none",
//         borderRadius: 2,
//         fontSize: "0.8rem",
//         fontWeight: 600,
//         cursor: loading ? "not-allowed" : "pointer",
//         fontFamily: "inherit",
//         marginTop: "0.75rem",
//       }}
//     >
//       {loading ? "Saving…" : label}
//     </button>
//   );
// }
// function Feedback({ msg, isError }: { msg: string; isError: boolean }) {
//   if (!msg) return null;
//   return (
//     <div
//       style={{
//         marginTop: "0.65rem",
//         fontSize: "0.78rem",
//         padding: "0.45rem 0.75rem",
//         borderRadius: 2,
//         background: isError ? "rgba(200,75,47,0.07)" : "rgba(45,122,79,0.07)",
//         color: isError ? "var(--rv-accent)" : "#2d7a4f",
//         border: `1px solid ${isError ? "rgba(200,75,47,0.2)" : "rgba(45,122,79,0.2)"}`,
//       }}
//     >
//       {msg}
//     </div>
//   );
// }

// // ── Name section ──────────────────────────────────────────

// function NameSection({ currentName }: { currentName: string }) {
//   const [name, setName] = useState(currentName);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [isError, setIsError] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setMsg("");
//     const res = await updateName(name);
//     setIsError(!!res?.error);
//     setMsg(res?.error ?? "Name updated successfully.");
//     setLoading(false);
//   }

//   return (
//     <div style={card}>
//       <SectionTitle>Display Name</SectionTitle>
//       <SectionDesc>
//         This is the name shown in your dashboard and on your resumes by default.
//       </SectionDesc>
//       <form onSubmit={handleSubmit}>
//         <Label>Full Name</Label>
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           style={{ ...inp, maxWidth: 360 }}
//           placeholder="Your name"
//         />
//         <SaveBtn loading={loading} />
//         <Feedback msg={msg} isError={isError} />
//       </form>
//     </div>
//   );
// }

// // ── Password section ──────────────────────────────────────

// function PasswordSection() {
//   const [current, setCurrent] = useState("");
//   const [next, setNext] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [isError, setIsError] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setMsg("");
//     if (next !== confirm) {
//       setIsError(true);
//       setMsg("New passwords don't match.");
//       return;
//     }
//     if (next.length < 8) {
//       setIsError(true);
//       setMsg("Password must be at least 8 characters.");
//       return;
//     }
//     setLoading(true);
//     const { error } = await authClient.changePassword({
//       currentPassword: current,
//       newPassword: next,
//       revokeOtherSessions: true,
//     });
//     setIsError(!!error);
//     setMsg(error?.message ?? "Password changed successfully.");
//     if (!error) {
//       setCurrent("");
//       setNext("");
//       setConfirm("");
//     }
//     setLoading(false);
//   }

//   return (
//     <div style={card}>
//       <SectionTitle>Change Password</SectionTitle>
//       <SectionDesc>
//         Choose a strong password of at least 8 characters.
//       </SectionDesc>
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "0.75rem",
//           maxWidth: 360,
//         }}
//       >
//         <div>
//           <Label>Current Password</Label>
//           <input
//             type="password"
//             value={current}
//             onChange={(e) => setCurrent(e.target.value)}
//             style={inp}
//             placeholder="••••••••"
//             autoComplete="current-password"
//           />
//         </div>
//         <div>
//           <Label>New Password</Label>
//           <input
//             type="password"
//             value={next}
//             onChange={(e) => setNext(e.target.value)}
//             style={inp}
//             placeholder="••••••••"
//             autoComplete="new-password"
//           />
//         </div>
//         <div>
//           <Label>Confirm New Password</Label>
//           <input
//             type="password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             style={inp}
//             placeholder="••••••••"
//             autoComplete="new-password"
//           />
//         </div>
//         <SaveBtn loading={loading} label="Change Password" />
//         <Feedback msg={msg} isError={isError} />
//       </form>
//       <p
//         style={{
//           marginTop: "0.75rem",
//           fontSize: "0.72rem",
//           color: "var(--rv-muted)",
//         }}
//       >
//         Forgot your password?{" "}
//         <Link
//           href="/forgot-password"
//           style={{ color: "var(--rv-accent)", textDecoration: "underline" }}
//         >
//           Reset via email
//         </Link>
//       </p>
//     </div>
//   );
// }

// // ── Danger zone ───────────────────────────────────────────

// function DangerZone() {
//   const router = useRouter();
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   async function handleDelete(e: React.FormEvent) {
//     e.preventDefault();
//     if (confirm !== "DELETE") return;
//     setLoading(true);
//     await authClient.signOut();
//     const res = await deleteAccount();
//     if (res?.error) {
//       setMsg(res.error);
//       setLoading(false);
//       return;
//     }
//     router.push("/");
//   }

//   return (
//     <div
//       style={{
//         ...card,
//         border: "1px solid rgba(200,75,47,0.3)",
//         background: "rgba(200,75,47,0.02)",
//       }}
//     >
//       <SectionTitle>Danger Zone</SectionTitle>
//       <SectionDesc>
//         Permanently delete your account and all associated resumes. This action
//         cannot be undone.
//       </SectionDesc>

//       {!showForm ? (
//         <button
//           onClick={() => setShowForm(true)}
//           style={{
//             padding: "0.5rem 1.25rem",
//             background: "transparent",
//             color: "var(--rv-accent)",
//             border: "1px solid var(--rv-accent)",
//             borderRadius: 2,
//             fontSize: "0.8rem",
//             fontWeight: 600,
//             cursor: "pointer",
//             fontFamily: "inherit",
//           }}
//         >
//           Delete Account
//         </button>
//       ) : (
//         <form onSubmit={handleDelete} style={{ maxWidth: 360 }}>
//           <p
//             style={{
//               fontSize: "0.78rem",
//               color: "var(--rv-ink)",
//               marginBottom: "0.75rem",
//               lineHeight: 1.55,
//             }}
//           >
//             This will permanently delete <strong>all your resumes</strong> and
//             your account. Type <strong>DELETE</strong> to confirm.
//           </p>
//           <input
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             placeholder="Type DELETE to confirm"
//             style={{ ...inp, marginBottom: "0.5rem" }}
//           />
//           <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
//             <button
//               type="submit"
//               disabled={confirm !== "DELETE" || loading}
//               style={{
//                 padding: "0.5rem 1.25rem",
//                 background:
//                   confirm === "DELETE" ? "var(--rv-accent)" : "var(--rv-muted)",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 2,
//                 fontSize: "0.8rem",
//                 fontWeight: 600,
//                 cursor:
//                   confirm === "DELETE" && !loading ? "pointer" : "not-allowed",
//                 fontFamily: "inherit",
//               }}
//             >
//               {loading ? "Deleting…" : "Permanently Delete"}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setShowForm(false);
//                 setConfirm("");
//               }}
//               style={{
//                 padding: "0.5rem 1.25rem",
//                 background: "none",
//                 color: "var(--rv-muted)",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 fontSize: "0.8rem",
//                 cursor: "pointer",
//                 fontFamily: "inherit",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//           {msg && <Feedback msg={msg} isError />}
//         </form>
//       )}
//     </div>
//   );
// }

// // ── Page ──────────────────────────────────────────────────

// export default function SettingsPage() {
//   const { data: session } = useSession();

//   return (
//     <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
//       {/* Page header */}
//       <div style={{ marginBottom: "2rem" }}>
//         <Link
//           href="/dashboard"
//           style={{
//             fontSize: "0.75rem",
//             color: "var(--rv-muted)",
//             textDecoration: "none",
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             marginBottom: "1rem",
//           }}
//         >
//           ← Back to Dashboard
//         </Link>
//         <h1
//           className="font-serif"
//           style={{
//             fontSize: "1.75rem",
//             color: "var(--rv-ink)",
//             marginBottom: "0.25rem",
//           }}
//         >
//           Account Settings
//         </h1>
//         <p style={{ fontSize: "0.82rem", color: "var(--rv-muted)" }}>
//           {session?.user?.email}
//         </p>
//       </div>

//       <NameSection currentName={session?.user?.name ?? ""} />
//       <PasswordSection />
//       <DangerZone />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import Link from "next/link";
import { updateName, deleteAccount } from "@/actions/settings.actions";

// ── Shared styles ─────────────────────────────────────────

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.85rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const card: React.CSSProperties = {
  background: "var(--rv-white)",
  border: "1px solid var(--rv-border)",
  borderRadius: 4,
  padding: "1.75rem 2rem",
  marginBottom: "1.25rem",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "0.95rem",
        fontWeight: 700,
        color: "var(--rv-ink)",
        marginBottom: "0.25rem",
      }}
    >
      {children}
    </h2>
  );
}
function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.78rem",
        color: "var(--rv-muted)",
        marginBottom: "1.25rem",
        lineHeight: 1.55,
      }}
    >
      {children}
    </p>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "var(--rv-muted)",
        marginBottom: 5,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
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
      style={{
        padding: "0.5rem 1.25rem",
        background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
        color: "#fff",
        border: "none",
        borderRadius: 2,
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        marginTop: "0.75rem",
      }}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}
function Feedback({ msg, isError }: { msg: string; isError: boolean }) {
  if (!msg) return null;
  return (
    <div
      style={{
        marginTop: "0.65rem",
        fontSize: "0.78rem",
        padding: "0.45rem 0.75rem",
        borderRadius: 2,
        background: isError ? "rgba(200,75,47,0.07)" : "rgba(45,122,79,0.07)",
        color: isError ? "var(--rv-accent)" : "#2d7a4f",
        border: `1px solid ${isError ? "rgba(200,75,47,0.2)" : "rgba(45,122,79,0.2)"}`,
      }}
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
    <div style={card}>
      <SectionTitle>Display Name</SectionTitle>
      <SectionDesc>
        This is the name shown in your dashboard and on your resumes by default.
      </SectionDesc>
      <form onSubmit={handleSubmit}>
        <Label>Full Name</Label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ ...inp, maxWidth: 360 }}
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
    <div style={card}>
      <SectionTitle>Change Password</SectionTitle>
      <SectionDesc>
        Choose a strong password of at least 8 characters.
      </SectionDesc>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: 360,
        }}
      >
        <div>
          <Label>Current Password</Label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            style={inp}
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
            style={inp}
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
            style={inp}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <SaveBtn loading={loading} label="Change Password" />
        <Feedback msg={msg} isError={isError} />
      </form>
      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.72rem",
          color: "var(--rv-muted)",
        }}
      >
        Forgot your password?{" "}
        <Link
          href="/forgot-password"
          style={{ color: "var(--rv-accent)", textDecoration: "underline" }}
        >
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

  // Read plan from session via a quick fetch — simplest pattern without extra props
  const [plan, setPlan] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? "free"))
      .catch(() => setPlan("free"));
  }, []);

  const isPro = plan === "pro";

  return (
    <div style={{ ...card, marginBottom: "1.25rem" }}>
      <SectionTitle>Plan & Billing</SectionTitle>
      <SectionDesc>
        {isPro
          ? "You're on the Pro plan. Manage your subscription or update payment details below."
          : "You're on the Free plan — 10 AI uses per month, 3 templates, PDF export only."}
      </SectionDesc>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1rem",
          background: "var(--rv-cream)",
          borderRadius: 2,
          border: "1px solid var(--rv-border)",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--rv-ink)",
              marginBottom: 2,
            }}
          >
            {isPro ? "✦ Pro Plan" : "Free Plan"}
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--rv-muted)" }}>
            {isPro
              ? "Unlimited AI · All templates · PDF + DOCX · No watermark"
              : "10 AI uses/month · 3 templates · PDF only"}
          </p>
        </div>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: 99,
            background: isPro ? "rgba(45,90,61,0.1)" : "rgba(138,132,120,0.1)",
            color: isPro ? "#2d5a3d" : "var(--rv-muted)",
          }}
        >
          {isPro ? "Active" : "Free"}
        </span>
      </div>

      {isPro ? (
        <button
          onClick={handlePortal}
          disabled={loading}
          style={{
            padding: "0.5rem 1.25rem",
            background: "var(--rv-ink)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Loading…" : "Manage Subscription"}
        </button>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            padding: "0.5rem 1.25rem",
            background: "var(--rv-accent)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
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
    await authClient.signOut();
    const res = await deleteAccount();
    if (res?.error) {
      setMsg(res.error);
      setLoading(false);
      return;
    }
    router.push("/");
  }

  return (
    <div
      style={{
        ...card,
        border: "1px solid rgba(200,75,47,0.3)",
        background: "rgba(200,75,47,0.02)",
      }}
    >
      <SectionTitle>Danger Zone</SectionTitle>
      <SectionDesc>
        Permanently delete your account and all associated resumes. This action
        cannot be undone.
      </SectionDesc>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "0.5rem 1.25rem",
            background: "transparent",
            color: "var(--rv-accent)",
            border: "1px solid var(--rv-accent)",
            borderRadius: 2,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} style={{ maxWidth: 360 }}>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--rv-ink)",
              marginBottom: "0.75rem",
              lineHeight: 1.55,
            }}
          >
            This will permanently delete <strong>all your resumes</strong> and
            your account. Type <strong>DELETE</strong> to confirm.
          </p>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            style={{ ...inp, marginBottom: "0.5rem" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              type="submit"
              disabled={confirm !== "DELETE" || loading}
              style={{
                padding: "0.5rem 1.25rem",
                background:
                  confirm === "DELETE" ? "var(--rv-accent)" : "var(--rv-muted)",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor:
                  confirm === "DELETE" && !loading ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Deleting…" : "Permanently Delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setConfirm("");
              }}
              style={{
                padding: "0.5rem 1.25rem",
                background: "none",
                color: "var(--rv-muted)",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
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
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/dashboard"
          style={{
            fontSize: "0.75rem",
            color: "var(--rv-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: "1rem",
          }}
        >
          ← Back to Dashboard
        </Link>
        <h1
          className="font-serif"
          style={{
            fontSize: "1.75rem",
            color: "var(--rv-ink)",
            marginBottom: "0.25rem",
          }}
        >
          Account Settings
        </h1>
        <p style={{ fontSize: "0.82rem", color: "var(--rv-muted)" }}>
          {session?.user?.email}
        </p>
      </div>

      <NameSection currentName={session?.user?.name ?? ""} />
      <PasswordSection />
      <BillingSection />
      <DangerZone />
    </div>
  );
}
