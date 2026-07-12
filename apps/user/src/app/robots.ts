import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // --- AI Retrieval Bots (drive citations in AI search answers) ---
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
      // --- AI Training Bots (feed model training data) ---
      // Allowed because IELTS Vocabs is a free educational resource.
      // To block training while keeping retrieval, change allow to disallow.
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
