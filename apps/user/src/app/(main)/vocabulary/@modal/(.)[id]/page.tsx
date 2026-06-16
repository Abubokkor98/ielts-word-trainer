import { safeDecodeURIComponent } from '@ielts/utils';
import { vocabularyData } from '../../../../../data/vocabulary';
import { InterceptedModalClient } from './modal-client';

interface InterceptedWordPageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedWordPage({ params }: InterceptedWordPageProps) {
  const { id } = await params;
  const decodedId = safeDecodeURIComponent(id);

  if (!decodedId) {
    return null;
  }

  const word = vocabularyData.find(
    (w) => w.id === decodedId || w.word.toLowerCase() === decodedId.toLowerCase()
  );

  if (!word) {
    return null;
  }

  return <InterceptedModalClient word={word} />;
}
