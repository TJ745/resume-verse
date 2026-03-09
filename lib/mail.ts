import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT ?? 587),
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

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
