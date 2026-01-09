import { User } from '../users/users.model';
import { AppError } from '../../core/errors/AppError';
import { Logger } from '@ielts/utils';

export class CSVExportService {
  /**
   * Sanitize CSV field to prevent CSV injection attacks
   * Escape special characters and wrap in quotes if necessary
   */
  private static sanitizeField(field: any): string {
    if (field === null || field === undefined) {
      return '';
    }

    const value = String(field);

    // Prevent CSV injection by escaping fields that start with special characters
    const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
    let sanitized = value;

    if (dangerousChars.some((char) => sanitized.startsWith(char))) {
      sanitized = `'${sanitized}`;
    }

    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    if (
      sanitized.includes(',') ||
      sanitized.includes('"') ||
      sanitized.includes('\n')
    ) {
      sanitized = `"${sanitized.replace(/"/g, '""')}"`;
    }

    return sanitized;
  }

  /**
   * Convert user data to CSV row
   */
  private static userToCSVRow(user: any): string {
    const fields = [
      user.name || '',
      user.email || '',
      user.role || 'user',
      user.status || 'active',
      user.xp?.toString() || '0',
      user.streak?.toString() || '0',
      user.createdAt ? new Date(user.createdAt).toISOString() : '',
      user.updatedAt ? new Date(user.updatedAt).toISOString() : '',
    ];

    return fields.map((field) => this.sanitizeField(field)).join(',');
  }

  /**
   * Generate CSV header row
   */
  private static getCSVHeader(): string {
    return 'name,email,role,status,xp,streak,createdAt,updatedAt';
  }

  /**
   * Export all users as CSV
   * Excludes sensitive fields like passwordHash, refreshToken, resetPasswordToken
   */
  static async exportUsers(): Promise<string> {
    try {
      Logger.info('Starting user CSV export');

      // Query all users excluding sensitive fields
      const users = await User.find({})
        .select(
          '-passwordHash -refreshToken -resetPasswordToken -resetPasswordExpires'
        )
        .sort({ createdAt: -1 })
        .lean();

      Logger.info(`Found ${users.length} users to export`);

      // Build CSV content
      const header = this.getCSVHeader();
      const rows = users.map((user) => this.userToCSVRow(user));
      const csvContent = [header, ...rows].join('\n');

      Logger.info('User CSV export completed successfully');

      return csvContent;
    } catch (error: any) {
      Logger.error(`CSV export failed: ${error.message}`);
      throw new AppError('Failed to export users', 500);
    }
  }
}
