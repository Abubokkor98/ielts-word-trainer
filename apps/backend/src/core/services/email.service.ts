import nodemailer from 'nodemailer';
import { Logger } from '@ielts/utils';

const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
  port: parseInt(process.env['SMTP_PORT'] || '587'),
  secure: false,
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env['CLIENT_URL']}/verify-email?token=${token}`;

    try {
      await transporter.sendMail({
        from: process.env['SMTP_FROM'] || 'noreply@ielts-platform.com',
        to: email,
        subject: 'Verify Your Email - IELTS Vocabulary Platform',
        html: `
          <h1>Email Verification</h1>
          <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      });
      Logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send verification email: ${error}`);
      throw error;
    }
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env['CLIENT_URL']}/reset-password?token=${token}`;

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
