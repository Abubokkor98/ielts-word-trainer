import { siteConfig } from '../../lib/site-config';

interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

interface BreadcrumbJsonLdProps {
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Generates BreadcrumbList JSON-LD structured data.
 * "Home" is always the first item — only pass the intermediate + final items.
 *
 * @example
 * // Guide page: Home → Guides → Spaced Repetition
 * <BreadcrumbJsonLd items={[
 *   { name: 'Guides', path: '/guides' },
 *   { name: 'Spaced Repetition', path: '/guides/spaced-repetition' },
 * ]} />
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      ...items.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: breadcrumb.name,
        item: `${siteConfig.url}${breadcrumb.path}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbList).replace(/</g, '\\u003c'),
      }}
    />
  );
}
