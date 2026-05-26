export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const safeDecodeURIComponent = (str: string): string | null => {
  try {
    return decodeURIComponent(str);
  } catch {
    return null;
  }
};
