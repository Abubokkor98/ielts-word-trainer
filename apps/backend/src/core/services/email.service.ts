import nodemailer from 'nodemailer';
import { AppError } from '../errors/AppError';
import { Logger } from '../../utils';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (!smtpHost || !smtpUser || !smtpPass) {
  throw new AppError(
    'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) must be fully configured.',
    500
  );
}

const port = Number(smtpPort ?? 587);
if (!Number.isInteger(port) || port <= 0) {
  throw new AppError(`Invalid SMTP_PORT: ${smtpPort}`, 500);
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
  static async sendPasswordResetEmail(
    email: string,
    token: string,
    role: string = 'user'
  ) {
    const baseUrl =
      role === 'admin' ? process.env.ADMIN_URL : process.env.CLIENT_URL;

    if (!baseUrl) {
      throw new AppError(
        `Missing base URL env for password reset email (role=${role}).`,
        500
      );
    }

    const resetUrl = new URL('/reset-password', baseUrl);
    resetUrl.searchParams.set('token', token);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"IELTS Vocabs" <noreply@ieltsvocabs.com>',
        to: email,
        subject: 'Password Reset - IELTS Vocabs',
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

  static async sendVerificationEmail(
    email: string,
    token: string,
    role: string = 'user'
  ) {
    const baseUrl =
      role === 'admin' ? process.env.ADMIN_URL : process.env.CLIENT_URL;

    if (!baseUrl) {
      throw new AppError(
        `Missing base URL env for verification email (role=${role}).`,
        500
      );
    }

    const verifyUrl = new URL('/verify', baseUrl);
    verifyUrl.searchParams.set('token', token);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"IELTS Vocabs" <noreply@ieltsvocabs.com>',
        to: email,
        subject: 'Verify your Email - IELTS Vocabs',
        html: `
          <h1>Email Verification</h1>
          <p>Thank you for registering! Please click the link below to verify your email address:</p>
          <a href="${verifyUrl}">Verify Email</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      });
      Logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send verification email: ${error}`);
      throw error;
    }
  }

  static async sendInactivityReminderEmail(
    email: string,
    name: string,
    daysInactive: number,
    role: string = 'user'
  ) {
    const baseUrl = role === 'admin' ? process.env.ADMIN_URL : process.env.CLIENT_URL;

    if (!baseUrl) {
      throw new AppError(
        `Missing base URL env for inactivity reminder email (role=${role}).`,
        500
      );
    }

    const appUrl = new URL('/quiz', baseUrl);

    let title = '';
    let message = '';

    if (daysInactive === 3) {
      title = "We miss you! 🚀";
      message = "It's been 3 days since your last quiz. Just 5 minutes of practice today will keep your vocabulary sharp!";
    } else if (daysInactive === 7) {
      title = "Don't lose your progress! 📉";
      message = "It's been a week! Consistency is key to mastering IELTS vocabulary. Log in now to jump back in.";
    } else if (daysInactive === 10) {
      title = "Are you still there? 😢";
      message = "10 days have passed. Your vocabulary might be fading! Come back and continue your journey to IELTS success.";
    } else {
      title = "Time to practice!";
      message = `It's been ${daysInactive} days since your last practice.`;
    }

    const safeName = name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"IELTS Vocabs" <noreply@ieltsvocabs.com>',
        to: email,
        subject: `${title} - IELTS Vocabs`,
        html: `
          <h1>Hi ${safeName},</h1>
          <p>${message}</p>
          <a href="${appUrl}">Resume Practice Now</a>
          <p>You can turn off smart learning reminders in your account settings.</p>
        `,
      });
      Logger.info(`Inactivity (${daysInactive} days) reminder email sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send inactivity reminder email: ${error}`);
      throw error;
    }
  }
}
