import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Word, WordFormData } from '../types';

interface UseWordFormProps {
  isOpen: boolean;
  initialData?: Word | null;
}

export function useWordForm({ isOpen, initialData }: UseWordFormProps) {
  const form = useForm<WordFormData>();
  const { reset } = form;

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Extract topic names from topics array
        const topicNames: string[] = [];
        if (initialData.topics) {
          initialData.topics.forEach((t) => {
            if (typeof t === 'object' && t !== null && 'name' in t) {
              topicNames.push(t.name);
            } else if (typeof t === 'string') {
              // If it's just a string ID or name, use it directly
              topicNames.push(t);
            }
          });
        }

        reset({
          word: initialData.word,
          meaning: initialData.meaning,
          exampleSentence: initialData.exampleSentence,
          difficulty: initialData.difficulty,
          partOfSpeech: initialData.partOfSpeech || '',
          topics: topicNames,
          modules:
            initialData.modules?.length > 0 ? initialData.modules : ['reading'],
          synonyms: initialData.synonyms?.join(', ') || '',
          antonyms: initialData.antonyms?.join(', ') || '',
        });
      } else {
        reset({
          word: '',
          meaning: '',
          exampleSentence: '',
          difficulty: '',
          partOfSpeech: '',
          topics: [],
          modules: ['reading'],
          synonyms: '',
          antonyms: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  return form;
}
