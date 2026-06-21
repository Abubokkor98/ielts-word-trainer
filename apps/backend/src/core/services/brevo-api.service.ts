/**
 * NOTE: VERCEL-ONLY — Safe to DELETE this entire file when migrating to VPS/Render.
 *
 * This service exists because Vercel Hobby has a 10-second function timeout,
 * so we use Brevo's REST API (fast HTTP calls) instead of slow SMTP connections.
 * On VPS with Agenda, there is no timeout — use EmailService.sendInactivityReminderEmail()
 * via Nodemailer SMTP instead. See also: cron.controller.ts, cron.routes.ts
 */
import { Logger } from '../../utils';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BATCH_SIZE = 5;
const BREVO_TIMEOUT_MS = 5_000;

interface BrevoSender {
  name: string;
  email: string;
}

export interface BrevoEmailRequest {
  to: { email: string; name: string };
  subject: string;
  htmlContent: string;
}

interface BrevoApiPayload {
  sender: BrevoSender;
  to: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
}

export interface BulkSendResult {
  totalSent: number;
  totalFailed: number;
  failures: Array<{ email: string; error: string }>;
}

export class BrevoApiService {
  private static getApiKey(): string {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is not configured');
    }
    return apiKey;
  }

  private static getSender(): BrevoSender {
    const smtpFrom =
      process.env.SMTP_FROM || '"IELTS Vocabs" <noreply@ieltsvocabs.com>';
    const match = smtpFrom.match(/"?([^"]*)"?\s*<(.+)>/);

    return {
      name: match?.[1]?.trim() || 'IELTS Vocabs',
      email: match?.[2]?.trim() || 'noreply@ieltsvocabs.com',
    };
  }

  private static async sendSingle(
    request: BrevoEmailRequest
  ): Promise<void> {
    const sender = BrevoApiService.getSender();

    const payload: BrevoApiPayload = {
      sender,
      to: [{ email: request.to.email, name: request.to.name }],
      subject: request.subject,
      htmlContent: request.htmlContent,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);

    try {
      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'api-key': BrevoApiService.getApiKey(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Brevo API ${response.status}: ${errorBody}`);
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error(`Brevo API timeout after ${BREVO_TIMEOUT_MS}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Sends emails in parallel batches of BATCH_SIZE.
   * Uses Promise.allSettled so one failure doesn't kill the entire batch.
   */
  static async sendBulk(
    requests: BrevoEmailRequest[]
  ): Promise<BulkSendResult> {
    if (requests.length === 0) {
      return { totalSent: 0, totalFailed: 0, failures: [] };
    }

    let totalSent = 0;
    let totalFailed = 0;
    const failures: Array<{ email: string; error: string }> = [];

    for (let i = 0; i < requests.length; i += BATCH_SIZE) {
      const batch = requests.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((request) => BrevoApiService.sendSingle(request))
      );

      results.forEach((result, index) => {
        const recipient = batch[index];
        if (result.status === 'fulfilled') {
          totalSent++;
        } else {
          totalFailed++;
          const errorMessage =
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason);
          failures.push({ email: recipient.to.email, error: errorMessage });
          Logger.error(
            `Failed to send email to ${recipient.to.email}: ${errorMessage}`
          );
        }
      });
    }

    Logger.info(
      `Bulk email complete: ${totalSent} sent, ${totalFailed} failed out of ${requests.length} total`
    );

    return { totalSent, totalFailed, failures };
  }
}
