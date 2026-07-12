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
      // AI crawlers: Explicitly allowed to maximize citation chances
      // in ChatGPT, Perplexity, Google AI Overviews, and Claude.
      // Since IELTSVocabs is a free educational resource, AI visibility
      // drives traffic and brand awareness.
      // To block AI training while keeping Search indexing, change
      // Google-Extended to disallow: ['/'].
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
