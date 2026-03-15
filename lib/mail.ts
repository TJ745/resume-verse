import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT ?? 587),
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const firstName = name?.split(" ")[0] ?? "there";
  await transporter.sendMail({
    from: `"ResumeVerse" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: "Welcome to ResumeVerse 🎉",
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; color: #0f0e0d;">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.75rem; font-family: 'Georgia', serif;">
          Welcome, ${firstName} 👋
        </h2>
        <p style="color: #8a8478; line-height: 1.65; margin-bottom: 1.25rem;">
          Your ResumeVerse account is ready. Here's what you can do right now:
        </p>
        <ul style="color: #3a3835; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1.5rem;">
          <li>Build a resume with AI-generated bullet points</li>
          <li>Run an ATS Score to see how your resume performs</li>
          <li>Paste a job description and optimize your resume in one click</li>
          <li>Generate a tailored cover letter in seconds</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; padding: 0.65rem 1.5rem; background: #c84b2f; color: #fff; text-decoration: none; border-radius: 2px; font-weight: 700; font-size: 0.875rem;">
          Go to Dashboard →
        </a>
        <p style="margin-top: 2rem; font-size: 0.75rem; color: #8a8478;">
          — The ResumeVerse team
        </p>
      </div>
    `,
  });
}

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  await transporter.sendMail({
    from: `"ResumeVerse" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: "Reset your ResumeVerse password",
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-size: 1.5rem; color: #0f0e0d; margin-bottom: 1rem;">
          Reset your password
        </h2>
        <p style="color: #8a8478; line-height: 1.6; margin-bottom: 2rem;">
          We received a request to reset your ResumeVerse password.
          Click the button below to choose a new one. This link expires in 1 hour.
        </p>
        <a
          href="${url}"
          style="
            display: inline-block;
            background: #c84b2f;
            color: #fdfcfa;
            padding: 0.75rem 1.75rem;
            border-radius: 2px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9375rem;
          "
        >
          Reset password
        </a>
        <p style="color: #8a8478; font-size: 0.8125rem; margin-top: 2rem;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}