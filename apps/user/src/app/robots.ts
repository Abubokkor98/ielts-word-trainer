import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/analytics/', '/profile/', '/review/'],
    },
    sitemap: 'https://ieltsvocabs.vercel.app/sitemap.xml',
  };
}
