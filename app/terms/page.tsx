import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of ResumeVerse.",
};

const LAST_UPDATED = "March 2026";

export default function TermsPage() {
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
          Terms of Service
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

        <Section title="1. Acceptance of Terms">
          By creating an account or using ResumeVerse, you agree to these Terms
          of Service. If you do not agree, do not use the service. We may update
          these terms from time to time — continued use constitutes acceptance
          of any changes.
        </Section>

        <Section title="2. Description of Service">
          ResumeVerse is an AI-powered resume builder that allows users to
          create, edit, and export resumes. We offer a Free plan and a Pro
          subscription plan. Features vary by plan as described on the Pricing
          page.
        </Section>

        <Section title="3. Account Registration">
          You must provide accurate information when creating an account. You
          are responsible for maintaining the security of your account
          credentials. Notify us immediately of any unauthorized use of your
          account.
        </Section>

        <Section title="4. Acceptable Use">
          You agree not to: use the service for any unlawful purpose; upload
          content that infringes on intellectual property rights; attempt to
          reverse-engineer, hack, or disrupt the service; use automated tools to
          scrape or bulk-access the service; resell or redistribute the service
          without permission.
        </Section>

        <Section title="5. Intellectual Property">
          <b>Your content:</b> You retain ownership of all resume content you
          create. By using the service, you grant us a limited license to store
          and process your content solely to provide the service.
          <br />
          <br />
          <b>Our content:</b> The ResumeVerse platform, templates, brand, and
          code are owned by ResumeVerse. You may not copy, modify, or
          redistribute them.
        </Section>

        <Section title="6. Free Plan Limitations">
          The Free plan is limited to 1 resume, 3 templates, PDF export only,
          and 10 AI uses per month. These limits are enforced automatically. We
          reserve the right to modify Free plan limits with reasonable notice.
        </Section>

        <Section title="7. Pro Plan & Billing">
          Pro subscriptions are billed monthly through LemonSqueezy. The first 7
          days are a free trial — you will not be charged until the trial ends.
          You may cancel at any time from Settings → Manage Billing.
          Cancellations take effect at the end of the current billing period. We
          do not offer refunds for partial billing periods.
        </Section>

        <Section title="8. AI-Generated Content">
          AI-generated content (resume bullets, cover letters, etc.) is produced
          by OpenAI's models. We do not guarantee accuracy or completeness of AI
          output. You are responsible for reviewing all AI-generated content
          before using it in job applications.
        </Section>

        <Section title="9. Disclaimers">
          ResumeVerse is provided "as is" without warranties of any kind. We do
          not guarantee that the service will be uninterrupted, error-free, or
          that use of our resumes will result in employment. We are not
          responsible for hiring decisions made by third parties.
        </Section>

        <Section title="10. Limitation of Liability">
          To the maximum extent permitted by law, ResumeVerse shall not be
          liable for any indirect, incidental, special, or consequential damages
          arising from use of the service. Our total liability to you shall not
          exceed the amount you paid us in the 12 months prior to the claim.
        </Section>

        <Section title="11. Termination">
          We reserve the right to suspend or terminate accounts that violate
          these terms, with or without notice. You may delete your account at
          any time from Settings. Upon termination, your data will be deleted
          within 30 days.
        </Section>

        <Section title="12. Governing Law">
          These terms are governed by applicable law. Any disputes shall be
          resolved through binding arbitration or in the courts of competent
          jurisdiction.
        </Section>

        <Section title="13. Contact">
          For questions about these terms, contact us at:{" "}
          <a
            href="mailto:legal@resumeverse.com"
            style={{ color: "var(--rv-accent)" }}
          >
            legal@resumeverse.com
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
