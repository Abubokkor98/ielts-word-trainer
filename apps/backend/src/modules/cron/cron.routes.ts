/**
 * NOTE: VERCEL-ONLY — Safe to DELETE this entire file when migrating to VPS/Render.
 *
 * These routes expose the cron endpoint for Vercel's HTTP-based cron trigger.
 * On VPS, Agenda runs inside the process — no HTTP routes needed for scheduling.
 * Also remove the '/cron' route registration in api.routes.ts.
 */
import { Router } from 'express';
import { CronController } from './cron.controller';

const router = Router();

// No auth middleware — secured by CRON_SECRET header instead
router.get('/daily-emails', CronController.dailyInactivityEmails);

export default router;
