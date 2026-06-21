/**
 * NOTE: VERCEL-ONLY — Safe to DELETE this entire file when migrating to VPS/Render.
 *
 * This controller handles Vercel Cron's daily HTTP GET trigger for inactivity emails.
 * On VPS, Agenda handles scheduling and triggers EmailService.sendInactivityReminderEmail()
 * directly — no HTTP endpoint needed. See also: brevo-api.service.ts, cron.routes.ts
 */
import type { Request, Response } from 'express';
import { User } from '../users/users.model';
import {
  BrevoApiService,
  type BrevoEmailRequest,
} from '../../core/services/brevo-api.service';

const INACTIVITY_THRESHOLDS_DAYS = [3, 7, 10] as const;

const verifyCronSecret = (req: Request): boolean => {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;
  return authHeader === `Bearer ${cronSecret}`;
};

const sanitizeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface InactivityEmailContent {
  subject: string;
  htmlContent: string;
}

const buildInactivityEmail = (
  name: string,
  daysInactive: number,
  role: string
): InactivityEmailContent => {
  const baseUrl =
    role === 'admin' ? process.env.ADMIN_URL : process.env.CLIENT_URL;
  const appUrl = baseUrl ? new URL('/quiz', baseUrl).toString() : '#';
  const safeName = sanitizeHtml(name);

  let title = '';
  let message = '';

  if (daysInactive === 3) {
    title = 'We miss you! 🚀';
    message =
      "It's been 3 days since your last quiz. Just 5 minutes of practice today will keep your vocabulary sharp!";
  } else if (daysInactive === 7) {
    title = "Don't lose your progress! 📉";
    message =
      "It's been a week! Consistency is key to mastering IELTS vocabulary. Log in now to jump back in.";
  } else if (daysInactive === 10) {
    title = 'Are you still there? 😢';
    message =
      '10 days have passed. Your vocabulary might be fading! Come back and continue your journey to IELTS success.';
  } else {
    title = 'Time to practice!';
    message = `It's been ${daysInactive} days since your last practice.`;
  }

  return {
    subject: `${title} - IELTS Vocabs`,
    htmlContent: `
      <h1>Hi ${safeName},</h1>
      <p>${message}</p>
      <a href="${appUrl}">Resume Practice Now</a>
      <p>You can turn off smart learning reminders in your account settings.</p>
    `,
  };
};

export class CronController {
  /**
   * Daily sweep: find inactive users and send reminder emails in bulk.
   * Triggered by Vercel Cron once per day.
   *
   * Uses Brevo REST API with parallel batching instead of
   * sequential SMTP to handle hundreds of users within Vercel's timeout.
   *
   * Security: Only accessible with a valid CRON_SECRET Bearer token.
   */
  static async dailyInactivityEmails(req: Request, res: Response) {
    if (!verifyCronSecret(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const now = new Date();
    const emailRequests: BrevoEmailRequest[] = [];

    try {
      for (const days of INACTIVITY_THRESHOLDS_DAYS) {
        // Calculate the date range for "exactly N days ago" (24h window)
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() - days);

        const windowStart = new Date(targetDate);
        windowStart.setHours(0, 0, 0, 0);

        const windowEnd = new Date(targetDate);
        windowEnd.setHours(23, 59, 59, 999);

        // Find users whose last activity was exactly N days ago
        const inactiveUsers = await User.find({
          isEmailVerified: true,
          status: 'active',
          $or: [
            // Last quiz OR last review — whichever is more recent
            {
              lastQuizDate: { $gte: windowStart, $lte: windowEnd },
              $or: [
                { lastReviewDate: { $exists: false } },
                { lastReviewDate: { $lte: windowEnd } },
              ],
            },
            {
              lastReviewDate: { $gte: windowStart, $lte: windowEnd },
              $or: [
                { lastQuizDate: { $exists: false } },
                { lastQuizDate: { $lte: windowEnd } },
              ],
            },
          ],
        })
          .select('email name role lastQuizDate lastReviewDate')
          .lean();

        // Build email content for each inactive user and add to the bulk queue
        for (const user of inactiveUsers) {
          const { subject, htmlContent } = buildInactivityEmail(
            user.name,
            days,
            user.role
          );

          emailRequests.push({
            to: { email: user.email, name: user.name },
            subject,
            htmlContent,
          });
        }
      }

      // Send all collected emails in parallel batches via Brevo REST API
      const result = await BrevoApiService.sendBulk(emailRequests);

      return res.status(200).json({
        success: true,
        message: `Daily inactivity sweep complete. ${result.totalSent} sent, ${result.totalFailed} failed.`,
      });
    } catch (error) {
      console.error('Cron daily-emails error:', error);
      return res.status(500).json({
        success: false,
        message: 'Cron job failed',
      });
    }
  }
}
