import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

export interface EmailJob {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(job: EmailJob) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: job.to,
    subject: job.subject,
    html: job.html
  });
  console.log('[Email] sent to', job.to);
}
