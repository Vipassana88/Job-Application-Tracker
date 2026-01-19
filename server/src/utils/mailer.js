import nodemailer from "nodemailer";

export function getTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || "true") === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const transporter = getTransporter();

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject = "Reset your Job Tracker password";

  const text = `You requested a password reset.\n\nReset link (valid for 15 minutes):\n${resetUrl}\n\nIf you did not request this, ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password Reset</h2>
      <p>You requested a password reset for Job Tracker.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#111;color:#fff;border-radius:10px;text-decoration:none;">
          Reset Password
        </a>
      </p>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}
