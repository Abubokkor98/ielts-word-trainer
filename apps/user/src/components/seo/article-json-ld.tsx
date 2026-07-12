import { CONTACT_LINKS } from '@ielts/shared';
import { siteConfig } from '../../lib/site-config';

interface ArticleJsonLdProps {
  readonly headline: string;
  readonly description: string;
  readonly path: string;
  readonly datePublished: string;
  readonly dateModified: string;
}

/**
 * Generates Article JSON-LD for guide pages.
 * Author and publisher data are pulled from shared constants — invisible
 * to users, only consumed by search engines and AI systems.
 */
export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${siteConfig.url}${path}`,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: CONTACT_LINKS.creatorName,
      url: CONTACT_LINKS.developer.portfolio,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.displayName,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${path}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
      }}
    />
  );
}
