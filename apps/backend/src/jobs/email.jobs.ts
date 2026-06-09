import { agenda } from '../config/agenda';
import { EmailService } from '../core/services/email.service';
import { User } from '../modules/users/users.model';
import { z } from 'zod';

const inactivityPayloadSchema = z.object({
  userId: z.string().min(1),
  daysInactive: z.number().int().positive(),
});

export const defineEmailJobs = () => {
  agenda.define('send-inactivity-reminder', async (job) => {
    const parsed = inactivityPayloadSchema.safeParse(job.attrs.data);
    if (!parsed.success) return;
    const { userId, daysInactive } = parsed.data;
    
    // 1. Check if user still exists
    const user = await User.findById(userId);
    if (!user || !user.isEmailVerified) return; // Don't send if deleted or unverified

    // 2. Send the email via Nodemailer
    await EmailService.sendInactivityReminderEmail(
      user.email,
      user.name,
      daysInactive,
      user.role
    );

    // 3. Chain the next job! If this was the 3-day reminder, schedule the 7-day reminder
    if (daysInactive === 3) {
      await agenda.schedule('in 4 days', 'send-inactivity-reminder', { userId, daysInactive: 7 });
    } else if (daysInactive === 7) {
      await agenda.schedule('in 3 days', 'send-inactivity-reminder', { userId, daysInactive: 10 });
    }
  });
};
