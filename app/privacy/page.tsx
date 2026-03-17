import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ResumeVerse collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "March 2026";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rv-paper)" }}>
      {/* Topbar */}
      <header
        style={{
          borderBottom: "1px solid var(--rv-border)",
          padding: "1.25rem 4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          className="font-serif text-xl no-underline"
          style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
        >
          Resume
          <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
            Verse
          </span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: "0.8rem",
            color: "var(--rv-muted)",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--rv-accent)",
            marginBottom: "0.75rem",
          }}
        >
          Legal
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--rv-ink)",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
          }}
        >
          Privacy Policy
        </h1>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--rv-muted)",
            marginBottom: "3rem",
          }}
        >
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Introduction">
          ResumeVerse ("we", "us", or "our") operates the ResumeVerse website
          and application. This policy explains what information we collect, how
          we use it, and your rights regarding that information.
        </Section>

        <Section title="2. Information We Collect">
          <b>Account information:</b> When you register, we collect your name,
          email address, and a hashed password. We never store your password in
          plain text.
          <br />
          <br />
          <b>Resume content:</b> The resume data you enter (work history,
          education, skills, etc.) is stored securely in our database and used
          solely to provide the service to you.
          <br />
          <br />
          <b>Usage data:</b> We collect basic usage information such as pages
          visited, features used, and error logs to improve the product.
          <br />
          <br />
          <b>Payment information:</b> Payments are processed by LemonSqueezy. We
          do not store your credit card details. We only receive confirmation of
          successful or failed payments.
        </Section>

        <Section title="3. How We Use Your Information">
          We use collected information to: provide and maintain the service,
          process payments and manage subscriptions, send transactional emails
          (account confirmation, password reset, receipts), improve and debug
          the product, and communicate service-related updates. We do not sell,
          trade, or rent your personal information to third parties.
        </Section>

        <Section title="4. AI Processing">
          Resume content you submit to our AI features (ATS scoring, JD
          matching, content generation, etc.) is sent to OpenAI's API for
          processing. This data is subject to OpenAI's privacy policy. We do not
          use your resume data to train AI models.
        </Section>

        <Section title="5. Data Storage & Security">
          Your data is stored on Neon PostgreSQL servers. We use
          industry-standard security practices including HTTPS encryption,
          hashed passwords, and session-based authentication. While we take
          security seriously, no system is 100% secure.
        </Section>

        <Section title="6. Data Retention">
          We retain your account and resume data for as long as your account is
          active. You may delete your account and all associated data at any
          time from your Account Settings page. Deleted data is removed within
          30 days.
        </Section>

        <Section title="7. Cookies">
          We use session cookies for authentication only. We do not use
          advertising or tracking cookies.
        </Section>

        <Section title="8. Third-Party Services">
          We use the following third-party services: OpenAI (AI processing),
          LemonSqueezy (payment processing), Neon (database hosting), and
          Nodemailer (transactional email). Each has their own privacy policy.
        </Section>

        <Section title="9. Your Rights">
          You have the right to access, correct, or delete your personal data at
          any time. To export your resume data, use the PDF or DOCX export
          features. To delete your account and all data, go to Settings → Danger
          Zone. For other requests, contact us at the email below.
        </Section>

        <Section title="10. Children's Privacy">
          ResumeVerse is not intended for users under 16. We do not knowingly
          collect data from children under 16.
        </Section>

        <Section title="11. Changes to This Policy">
          We may update this policy from time to time. We will notify you of
          significant changes by email or by a notice on the dashboard.
          Continued use of the service after changes constitutes acceptance.
        </Section>

        <Section title="12. Contact">
          For privacy-related questions, contact us at:{" "}
          <a
            href="mailto:privacy@resumeverse.com"
            style={{ color: "var(--rv-accent)" }}
          >
            privacy@resumeverse.com
          </a>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--rv-ink)",
          marginBottom: "0.6rem",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--rv-muted)",
          lineHeight: 1.75,
        }}
      >
        {children}
      </p>
    </div>
  );
}
