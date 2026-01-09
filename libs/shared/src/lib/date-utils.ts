/**
 * Formats a date string or Date object to a readable string (e.g., "October 5, 2023").
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date string or Date object to a relative time string (e.g., "5m ago").
 * Handles edge cases like future dates (clock skew).
 *
 * @param date - The date to format. If string, should be ISO 8601 format.
 * @param skewWindow - Optional skew window in ms (default 5 mins) where future dates are treated as "Just now".
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: string | Date | undefined | null,
  skewWindow = 300000
): string {
  if (!date) return 'Never';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Validate the date object
  if (Number.isNaN(dateObj.getTime())) {
    return 'Never';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  // Handle future dates (clock skew)
  if (diffMs < 0) {
    if (diffMs > -skewWindow) {
      return 'Just now';
    }
    // Far future -> return explicit date
    return formatDate(dateObj);
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
