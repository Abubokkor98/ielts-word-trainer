import { safeDecodeURIComponent } from '@ielts/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BreadcrumbJsonLd } from '../../../../components/seo';
import { WordDetailsView } from '../../../../features/vocabulary/components/word-details-view';
import { siteConfig } from '../../../../lib/site-config';
import { vocabularyData } from '../../../../data/vocabulary';

export const dynamicParams = true;

interface StandaloneWordPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Pre-render ALL word pages — zero cost since data is from local JSON
  return vocabularyData.map((word) => ({
    id: word.word.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: StandaloneWordPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = safeDecodeURIComponent(id);

  if (!decodedId) {
    return {
      title: 'Word Not Found',
    };
  }

  const word = vocabularyData.find(
    (w) => w.word.toLowerCase() === decodedId.toLowerCase()
  );

  if (!word) {
    return {
      title: 'Word Not Found',
    };
  }

  const capitalizedWord = word.word.charAt(0).toUpperCase() + word.word.slice(1);

  return {
    title: `Meaning of "${capitalizedWord}" - Definition & Examples`,
    description: `Master the word "${word.word}" (${word.partOfSpeech}) for IELTS Band 8+. Meaning: ${word.meaning}.`,
    alternates: {
      canonical: `/vocabulary/${encodeURIComponent(word.word.toLowerCase())}`,
    },
  };
}

export default async function StandaloneWordPage({ params }: StandaloneWordPageProps) {
  const { id } = await params;
  const decodedId = safeDecodeURIComponent(id);

  if (!decodedId) {
    notFound();
  }

  const word = vocabularyData.find(
    (w) => w.word.toLowerCase() === decodedId.toLowerCase()
  );

  if (!word) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.meaning,
    termCode: word.partOfSpeech,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'IELTS Vocabulary',
      url: `${siteConfig.url}/vocabulary`,
    },
    ...(word.createdAt && { dateCreated: word.createdAt }),
    ...(word.updatedAt && { dateModified: word.updatedAt }),
  };

  const capitalizedWord = word.word.charAt(0).toUpperCase() + word.word.slice(1);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Vocabulary', path: '/vocabulary' },
          { name: capitalizedWord, path: `/vocabulary/${encodeURIComponent(word.word.toLowerCase())}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <WordDetailsView word={word} />
    </>
  );
}
