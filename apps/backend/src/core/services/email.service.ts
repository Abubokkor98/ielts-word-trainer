import { Logger } from '@ielts/utils';
import nodemailer from 'nodemailer';

const smtpHost = process.env['SMTP_HOST'];
const smtpPort = process.env['SMTP_PORT'];
const smtpUser = process.env['SMTP_USER'];
const smtpPass = process.env['SMTP_PASS'];

if (!smtpHost || !smtpUser || !smtpPass) {
  throw new Error('SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) must be fully configured.');
}

const port = Number(smtpPort ?? 587);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid SMTP_PORT: ${smtpPort}`);
}

const transporter = nodemailer.createTransport({
  host: smtpHost || 'smtp.gmail.com',
  port,
  secure: port === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export class EmailService {
  static async sendPasswordResetEmail(email: string, token: string, role: string = 'user') {
    const baseUrl = role === 'admin' ? process.env['ADMIN_URL'] : process.env['CLIENT_URL'];

    if (!baseUrl) {
      throw new Error(`Missing base URL env for password reset email (role=${role}).`);
    }

    const resetUrl = new URL('/reset-password', baseUrl);
    resetUrl.searchParams.set('token', token);

    try {
      await transporter.sendMail({
        from: process.env['SMTP_FROM'] || 'noreply@ielts-platform.com',
        to: email,
        subject: 'Password Reset - IELTS Vocabulary Platform',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested to reset your password. Click the link below to continue:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        `,
      });
      Logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send reset email: ${error}`);
      throw error;
    }
  }
}
